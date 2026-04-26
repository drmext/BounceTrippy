import { useToast } from '@chakra-ui/react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect, useMemo, useRef, useState } from 'react';
import { prepareVersionSettings } from './helpers';

function useGlobalData() {
    const queryClient = useQueryClient()
    const [isOnline, setIsOnline] = useState(null);
    const [selectedDdrProfileId, setSelectedDdrProfileId] = useState(null);
    const [selectedGfdmProfileId, setSelectedGfdmProfileId] = useState(null);
    const [selectedIidxProfileId, setSelectedIidxProfileId] = useState(null);

    const [mainDDRSettings, setMainDDRSettings] = useState(null);
    const [mainGFDMSettings, setMainGFDMSettings] = useState(null);
    const [mainIIDXSettings, setMainIIDXSettings] = useState(null);

    const [ddrVersionKeys, setDdrVersionKeys] = useState(null);
    const [ddrVersionSettings, setDdrVersionSettings] = useState(null);
    const [selectedDdrVersionKey, setSelectedDdrVersionKey] = useState(null);

    const [gfdmVersionKeys, setGfdmVersionKeys] = useState(null);
    const [gfdmVersionSettings, setGfdmVersionSettings] = useState(null);
    const [selectedGfdmVersionKey, setSelectedGfdmVersionKey] = useState(null);

    const [iidxVersionKeys, setIidxVersionKeys] = useState(null);
    const [iidxVersionSettings, setIidxVersionSettings] = useState(null);
    const [selectedIidxVersionKey, setSelectedIidxVersionKey] = useState(null);

    const [apiUrl, setApiUrl] = useState(null);
    const [ddrJson, setDdrJson] = useState(null);
    const [gfdmJson, setGfdmJson] = useState(null);

    const [selectedGame, setSelectedGame] = useState('DDR')

    // Track profile changes so we can snap version to latest on profile switch.
    const prevSelectedDdrProfileIdRef = useRef(null);
    const prevSelectedIidxProfileIdRef = useRef(null);

    const saveVersionString = {
        DDR: selectedDdrVersionKey,
        IIDX: selectedIidxVersionKey,
        GFDM: selectedGfdmVersionKey
    }[selectedGame]

    const disableRetry = {
        staleTime: Infinity,
        retry: 0,
        retryOnMount: false,
        retryOnReconnect: false,
        refetchOnWindowFocus: false
    }

    // Toasty
    const toast = useToast(), toasts = {
        loadMetadata: {
            success: {
                title: "Metadata Load Successful",
                description: `${selectedGame}.json saved`,
                status: "success",
                duration: 9000,
                isClosable: true,
            },
            failure: {
                title: "Metadata Load Failure",
                description: `startup.arc must contain "data/gamedata/musicdb.xml"`,
                status: "error",
                duration: 9000,
                isClosable: true,
            }
        },
        saveSettings: {
            success: {
                title: "Settings Saved",
                description: `${selectedGame} profile version ${saveVersionString}`,
                status: "success",
                duration: 9000,
                isClosable: true,
            },
            failure: {
                title: "Settings Failed to Save",
                description: `${selectedGame} profile version ${saveVersionString}`,
                status: "error",
                duration: 9000,
                isClosable: true,
            }
        }
    }

    // API Wrapper
    const API = {
        settings: {
            getConfig: () => axios.get(`${apiUrl}/config`),
            getMonkey: () => axios.get("./monkey.json"),
            getDdrJson: () => axios.get("./ddr.json"),
            getGfdmJson: () => axios.get("./gfdm.json"),
            getIidxJson: () => axios.get("./iidx.json"),
            getIidxNotecountsJson: () => axios.get("iidx-notecounts.json")
        },
        ddr: {
            getScoresByProfileId: () => axios.get(`${apiUrl}/ddr/scores/${selectedDdrProfileId}`),
            updateSettings: ({ selectedDdrProfileId, card, pin }) => axios.patch(`${apiUrl}/ddr/profiles/${selectedDdrProfileId}`, {
                card: card,
                pin: `${pin}`,
            }),
            updateProfileByIdAndVersion: ({ selectedDdrProfileId, selectedDdrVersionKey, ddrVersionSettings }) => axios.patch(
                `${apiUrl}/ddr/profiles/${selectedDdrProfileId}/${selectedDdrVersionKey}`,
                prepareVersionSettings(ddrVersionSettings)
            ),
        },
        gfdm: {
            getScoresByProfileId: () => axios.get(`${apiUrl}/gfdm/guitarfreaks/scores/${selectedGfdmProfileId}`),
            updateSettings: ({ selectedGfdmProfileId, card, pin }) => axios.patch(`${apiUrl}/gfdm/profiles/${selectedGfdmProfileId}`, {
                card: card,
                pin: `${pin}`,
            }),
            updateProfileByIdAndVersion: ({ selectedGfdmProfileId, selectedGfdmVersionKey, gfdmVersionSettings }) => axios.patch(
                `${apiUrl}/gfdm/profiles/${selectedGfdmProfileId}/${selectedGfdmVersionKey}`,
                gfdmVersionSettings
            ),
        },
        iidx: {
            getScoresByProfileId: () => axios.get(`${apiUrl}/iidx/scores/${selectedIidxProfileId}`),
            updateSettings: ({ selectedIidxProfileId, card, pin }) => axios.patch(`${apiUrl}/iidx/profiles/${selectedIidxProfileId}`, {
                card: card,
                pin: `${pin}`,
            }),
            updateProfileByIdAndVersion: ({ selectedIidxProfileId, selectedIidxVersionKey, iidxVersionSettings }) => axios.patch(
                `${apiUrl}/iidx/profiles/${selectedIidxProfileId}/${selectedIidxVersionKey}`,
                iidxVersionSettings
            ),
        }
    }

    // Settings
    useQuery(
        ["fetchSettings"],
        () => API.settings.getConfig(),
        { ...disableRetry, enabled: !!apiUrl }
    );

    useQuery(
        ["fetchMonkey"],
        () => API.settings.getMonkey(),
        {
            ...disableRetry,
            onSuccess: res => {
                setApiUrl(`http://${res.data?.ip}:${res.data?.port}`)
            }
        }
    );

    /** Load IIDX static JSON only when the IIDX tab is active — faster initial load + less memory on other tabs */
    const fetchIidxJsonQuery = useQuery(
        ["fetchIidxJson"],
        () => API.settings.getIidxJson(),
        { ...disableRetry, enabled: selectedGame === "IIDX" }
    );

    const fetchIidxNotecountsQuery = useQuery(
        ["fetchIidxNotecountJson"],
        () => API.settings.getIidxNotecountsJson(),
        { ...disableRetry, enabled: selectedGame === "IIDX" }
    );

    /** Same shape as before `setIidxJson(res.data)` — HTTP body from axios */
    const iidxJsonBody = fetchIidxJsonQuery.data?.data ?? null;

    /** O(1) song lookup; built once per metadata load instead of `reduce` on every render */
    const iidxMusicById = useMemo(() => {
        const rows = iidxJsonBody?.data;
        if (!Array.isArray(rows)) return null;
        const out = {};
        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            const id = row?.song_id;
            if (id != null) out[id] = row;
        }
        return out;
    }, [iidxJsonBody]);

    const iidxNotecountsJson = fetchIidxNotecountsQuery.data?.data ?? null;

    useQuery(
        ["fetchGfdmJson"],
        () => API.settings.getGfdmJson(),
        {
            ...disableRetry,
            onSuccess: res => setGfdmJson(res.data),
            enabled: false,

        }
    );

    useQuery(
        ["fetchDdrJson"],
        () => API.settings.getDdrJson(),
        {
            ...disableRetry,
            onSuccess: res => setDdrJson(res.data)
        }
    );

    // DDR — sort once in `select` so the list component does not allocate/sort again (faster + less work per render).
    const getDdrScoresByProfileIdQuery = useQuery(
        ["getDdrScoresByProfileId", selectedDdrProfileId],
        () => API.ddr.getScoresByProfileId(selectedDdrProfileId),
        {
            ...disableRetry,
            enabled: !!selectedDdrProfileId && !!apiUrl,
            select: (axiosResponse) => {
                // The DDR scores component expects `getScoresQuery.data.data` to be an array.
                // With axios, `axiosResponse.data` is the response body.
                const rows = axiosResponse?.data;
                if (!Array.isArray(rows) || rows.length === 0) return axiosResponse;

                const sorted = [...rows].sort((a, b) => b.timestamp - a.timestamp); // newest first

                // Preserve the axios response shape, but replace the array payload with the sorted array.
                return {
                    ...axiosResponse,
                    data: sorted,
                };
            },
        }
    );

    const getDdrProfilesQuery = useQuery(
        ["getDdrProfiles"],
        () => axios.get(`${apiUrl}/ddr/profiles`),
        { ...disableRetry, enabled: !!apiUrl }
    );

    const updateMainDDRSettingsMutation = useMutation(
        () => API.ddr.updateSettings({ selectedDdrProfileId, card: mainDDRSettings.card, pin: mainDDRSettings.pin }),
        {
            ...disableRetry,
            onSuccess: () => {
                toast(toasts.saveSettings.success);
                queryClient.invalidateQueries('getDdrProfiles')
            },
            onError: () => {
                toast(toasts.saveSettings.failure);
            },
        }
    );

    const updateDdrProfileVersionSettingsMutation = useMutation(
        () => API.ddr.updateProfileByIdAndVersion({ selectedDdrProfileId, selectedDdrVersionKey, ddrVersionSettings }),
        {
            ...disableRetry,
            onSuccess: (data) => {
                // invalidate getDdrProfilesQuery
            },
        }
    );

    const saveAllDdr = async () => {
        await updateMainDDRSettingsMutation.mutateAsync();
        await updateDdrProfileVersionSettingsMutation.mutateAsync();
        // reset and get everything
    };

    // GFDM
    const getGfdmScoresByProfileIdQuery = useQuery(
        ["getGfdmScoresByProfileId", selectedGfdmProfileId],
        () => API.gfdm.getScoresByProfileId(selectedGfdmProfileId),
        {
            ...disableRetry,
            // enabled: !!selectedGfdmProfileId && !!apiUrl,
            enabled: false
        }
    );

    const getGfdmProfilesQuery = useQuery(
        ["getGfdmProfiles"],
        () => axios.get(`${apiUrl}/gfdm/profiles`),
        { ...disableRetry, enabled: !!apiUrl }
    );

    const updateMainGFDMSettingsMutation = useMutation(
        () => API.gfdm.updateSettings({ selectedGfdmProfileId, card: mainGFDMSettings.card, pin: mainGFDMSettings.pin }),
        {
            onSuccess: () => {
                toast(toasts.saveSettings.success);
                queryClient.invalidateQueries('getGfdmProfiles')
            },
            onError: () => {
                toast(toasts.saveSettings.failure);
            },
        }
    );

    const updateGfdmProfileVersionSettingsMutation = useMutation(
        () => API.gfdm.updateProfileByIdAndVersion({
            selectedGfdmProfileId,
            selectedGfdmVersionKey,
            gfdmVersionSettings,
        })
    );

    const saveAllGfdm = async () => {
        await updateMainGFDMSettingsMutation.mutateAsync();
        await updateGfdmProfileVersionSettingsMutation.mutateAsync();
        // reset and get everything
    };

    // IIDX
    const getIidxProfilesQuery = useQuery(
        ["getIidxProfiles"],
        () => axios.get(`${apiUrl}/iidx/profiles`),
        { ...disableRetry, enabled: !!apiUrl && selectedGame === "IIDX" }
    );

    const getIidxScoresByProfileIdQuery = useQuery(
        ["getIidxScoresByProfileId", selectedIidxProfileId],
        () => axios.get(`${apiUrl}/iidx/scores/${selectedIidxProfileId}`),
        {
            ...disableRetry,
            enabled: !!selectedIidxProfileId && !!apiUrl && selectedGame === "IIDX",
            select: (axiosResponse) => {
                const body = axiosResponse?.data;
                const rows = Array.isArray(body) ? body : body?.data;
                if (!Array.isArray(rows) || rows.length === 0) return axiosResponse;
                const sorted = [...rows].sort(
                    (a, b) => (Number(b?.timestamp) || 0) - (Number(a?.timestamp) || 0)
                );
                if (Array.isArray(body)) {
                    return { ...axiosResponse, data: sorted };
                }
                return { ...axiosResponse, data: { ...body, data: sorted } };
            },
        }
    );

    const ddrProfilesData = useMemo(
        () => getDdrProfilesQuery?.data?.data ?? [],
        [getDdrProfilesQuery?.data?.data]
    );
    const gfdmProfilesData = useMemo(
        () => getGfdmProfilesQuery?.data?.data ?? [],
        [getGfdmProfilesQuery?.data?.data]
    );
    const iidxProfilesData = useMemo(
        () => getIidxProfilesQuery?.data?.data ?? [],
        [getIidxProfilesQuery?.data?.data]
    );

    const selectedDdrProfile = useMemo(
        () => ddrProfilesData.find((profile) => profile.ddr_id === parseInt(selectedDdrProfileId)),
        [ddrProfilesData, selectedDdrProfileId]
    );
    const selectedGfdmProfile = useMemo(
        () => gfdmProfilesData.find((profile) => profile.gitadora_id === parseInt(selectedGfdmProfileId)),
        [gfdmProfilesData, selectedGfdmProfileId]
    );
    const selectedIidxProfile = useMemo(
        () => iidxProfilesData.find((profile) => profile.iidx_id === parseInt(selectedIidxProfileId)),
        [iidxProfilesData, selectedIidxProfileId]
    );

    const updateMainIIDXSettingsMutation = useMutation(
        () => API.iidx.updateSettings({ selectedIidxProfileId, card: mainIIDXSettings.card, pin: mainIIDXSettings.pin }),
        {
            onSuccess: () => {
                toast(toasts.saveSettings.success);
                queryClient.invalidateQueries('getIidxProfiles')
            },
            onError: () => {
                toast(toasts.saveSettings.failure);
            },
        }
    );

    const onlyIncludeSelectedKeys = (obj, keys) => {
        return Object.fromEntries(Object.entries(obj).filter(([k, v]) => keys.includes(k)))
    }


    const accepted_payload = [
        "djname",
        "region",
        "head",
        "hair",
        "face",
        "hand",
        "body",
        "frame",
        "turntable",
        "explosion",
        "bgm",
        "sudden",
        "categoryvoice",
        "note",
        "fullcombo",
        "keybeam",
        "judgestring",
        "soundpreview",
        "grapharea",
        "effector_lock",
        "effector_type",
        "explosion_size",
        "alternate_hcn",
        "kokokara_start",
        "show_category_grade",
        "show_category_status",
        "show_category_difficulty",
        "show_category_alphabet",
        "show_category_rival_play",
        "show_category_rival_winlose",
        "show_category_all_rival_play",
        "show_category_arena_winlose",
        "show_rival_shop_info",
        "hide_play_count",
        "show_score_graph_cutin",
        "hide_iidx_id",
        "classic_hispeed",
        "beginner_option_swap",
        "show_lamps_as_no_play_in_arena",
        "skin_customize_flag_frame",
        "skin_customize_flag_bgm",
        "skin_customize_flag_lane",
        "sp_rival_1_iidx_id",
        "sp_rival_2_iidx_id",
        "sp_rival_3_iidx_id",
        "sp_rival_4_iidx_id",
        "sp_rival_5_iidx_id",
        "sp_rival_6_iidx_id",
        "dp_rival_1_iidx_id",
        "dp_rival_2_iidx_id",
        "dp_rival_3_iidx_id",
        "dp_rival_4_iidx_id",
        "dp_rival_5_iidx_id",
        "dp_rival_6_iidx_id",
    ]

    const translateKeys = (obj) => {
        const translations = {
            "_show_category_grade": "show_category_grade",
            "_show_category_status": "show_category_status",
            "_show_category_difficulty": "show_category_difficulty",
            "_show_category_alphabet": "show_category_alphabet",
            "_show_category_rival_play": "show_category_rival_play",
            "_show_category_rival_winlose": "show_category_rival_winlose",
            "_show_category_all_rival_play": "show_category_all_rival_play",
            "_show_category_arena_winlose": "show_category_arena_winlose",
            "_show_rival_shop_info": "show_rival_shop_info",
            "_hide_play_count": "hide_play_count",
            "_show_score_graph_cutin": "show_score_graph_cutin",
            "_hide_iidx_id": "hide_iidx_id",
            "_classic_hispeed": "classic_hispeed",
            "_beginner_option_swap": "beginner_option_swap",
            "_show_lamps_as_no_play_in_arena": "show_lamps_as_no_play_in_arena",
        }
        const entries = Object.entries(obj).map(([k, v]) => ([[translations[k] || k], v]))
        const res = Object.fromEntries(entries)
        return res
    }



    const updateIidxProfileVersionSettingsMutation = useMutation(
        () => API.iidx.updateProfileByIdAndVersion({
            selectedIidxProfileId,
            selectedIidxVersionKey,
            iidxVersionSettings: onlyIncludeSelectedKeys(translateKeys(iidxVersionSettings), accepted_payload),
        })
    );

    const saveAllIidx = async () => {
        await updateMainIIDXSettingsMutation.mutateAsync();
        await updateIidxProfileVersionSettingsMutation.mutateAsync();
        // reset and get everything
    };

    // DDR - if a profile is selected, get all its versions and settings    
    useEffect(() => {
        if (!selectedDdrProfileId) {
            setSelectedDdrVersionKey(null);
            setDdrVersionSettings(null);
            prevSelectedDdrProfileIdRef.current = null;
            return;
        }
        const selectedProfile = selectedDdrProfile;

        if (!selectedProfile) {
            setDdrVersionSettings(null);
            return;
        }

        const versionObjectKeys = Object.keys(selectedProfile.version);
        if (!versionObjectKeys.length) {
            setDdrVersionKeys([]);
            setSelectedDdrVersionKey(null);
            setDdrVersionSettings(null);
            prevSelectedDdrProfileIdRef.current = selectedDdrProfileId;
            return;
        }
        const versionKeys = versionObjectKeys.map((v) => parseInt(v));
        setDdrVersionKeys(versionKeys);

        const latestVersionKey = `${Math.max(...versionKeys)}`;
        const prevProfileId = prevSelectedDdrProfileIdRef.current;
        const profileChanged = prevProfileId !== selectedDdrProfileId;

        // On profile switch: always show the latest version for that profile.
        // On same profile: keep current version if still valid, otherwise default to latest.
        const hasCurrent = selectedDdrVersionKey && versionObjectKeys.includes(`${selectedDdrVersionKey}`);
        const nextVersionKey = profileChanged ? latestVersionKey : (hasCurrent ? `${selectedDdrVersionKey}` : latestVersionKey);
        setSelectedDdrVersionKey(nextVersionKey);
        setDdrVersionSettings(selectedProfile?.version?.[nextVersionKey] ?? null);

        setMainDDRSettings({
            pin: selectedProfile.pin,
            card: selectedProfile.card,
        });

        prevSelectedDdrProfileIdRef.current = selectedDdrProfileId;
    }, [selectedDdrProfileId, selectedDdrProfile, selectedDdrVersionKey]);

    // GFDM - if a profile is selected, get all its versions and settings    
    useEffect(() => {
        if (!selectedGfdmProfileId || !selectedGfdmProfile) return;

        setSelectedGfdmVersionKey(null);
        const selectedProfile = selectedGfdmProfile;

        if (!selectedProfile) return;

        const versionObjectKeys = Object.keys(selectedProfile.version);
        if (!versionObjectKeys.length) return;
        setGfdmVersionKeys(versionObjectKeys.map((v) => parseInt(v)));

        setMainGFDMSettings({
            pin: selectedProfile.pin,
            card: selectedProfile.card,
        });
    }, [selectedGfdmProfileId, selectedGfdmProfile]);

    // IIDX - if a profile is selected, get all its versions and settings    
    useEffect(() => {
        if (!selectedIidxProfileId) {
            setSelectedIidxVersionKey(null);
            setIidxVersionSettings(null);
            prevSelectedIidxProfileIdRef.current = null;
            return;
        }
        const selectedProfile = selectedIidxProfile;
        if (!selectedProfile) return;

        const versionObjectKeys = Object.keys(selectedProfile.version);
        if (!versionObjectKeys.length) {
            setIidxVersionKeys([]);
            setSelectedIidxVersionKey(null);
            setIidxVersionSettings(null);
            prevSelectedIidxProfileIdRef.current = selectedIidxProfileId;
            return;
        }

        const versionKeys = versionObjectKeys.map((v) => parseInt(v));
        setIidxVersionKeys(versionKeys);

        const latestVersionKey = `${Math.max(...versionKeys)}`;
        const prevProfileId = prevSelectedIidxProfileIdRef.current;
        const profileChanged = prevProfileId !== selectedIidxProfileId;

        // On profile switch: always show the latest version for that profile.
        // On same profile: keep current version if still valid, otherwise default to latest.
        const hasCurrent = selectedIidxVersionKey && versionObjectKeys.includes(`${selectedIidxVersionKey}`);
        const nextVersionKey = profileChanged ? latestVersionKey : (hasCurrent ? `${selectedIidxVersionKey}` : latestVersionKey);
        setSelectedIidxVersionKey(nextVersionKey);
        setIidxVersionSettings(selectedProfile?.version?.[nextVersionKey] ?? null);

        setMainIIDXSettings({
            pin: selectedProfile.pin,
            card: selectedProfile.card,
        });
        prevSelectedIidxProfileIdRef.current = selectedIidxProfileId;
    }, [selectedIidxProfileId, selectedIidxProfile, selectedIidxVersionKey]);

    // Set default version key to latest if the data exists
    useEffect(() => {
        if (!selectedDdrVersionKey && ddrVersionKeys?.length > 0) {
            const defaultVersionKey = Math.max(...ddrVersionKeys);
            setSelectedDdrVersionKey(`${defaultVersionKey}`);
        }
    }, [ddrVersionKeys, selectedDdrVersionKey]);

    useEffect(() => {
        if (gfdmVersionKeys?.length > 0) {
            const defaultVersionKey = Math.max(...gfdmVersionKeys);
            setSelectedGfdmVersionKey(`${defaultVersionKey}`);
        }
    }, [gfdmVersionKeys]);

    useEffect(() => {
        if (!selectedIidxVersionKey && iidxVersionKeys?.length > 0) {
            const defaultVersionKey = Math.max(...iidxVersionKeys);
            setSelectedIidxVersionKey(`${defaultVersionKey}`);
        }
    }, [iidxVersionKeys, selectedIidxVersionKey]);


    // DDR
    useEffect(() => {
        if (!selectedDdrVersionKey || !selectedDdrProfile) return;
        const selectedProfile = selectedDdrProfile;
        const nextSettings = selectedProfile?.version?.[selectedDdrVersionKey];
        if (!nextSettings) return;
        setDdrVersionSettings(nextSettings);
    }, [selectedDdrVersionKey, selectedDdrProfile]);

    // GFDM
    useEffect(() => {
        if (!selectedGfdmVersionKey || !selectedGfdmProfile) return;
        const selectedProfile = selectedGfdmProfile;
        setGfdmVersionSettings(selectedProfile?.version[selectedGfdmVersionKey]);
    }, [selectedGfdmVersionKey, selectedGfdmProfile]);

    // IIDX
    useEffect(() => {
        if (!selectedIidxVersionKey || !selectedIidxProfile) return;
        const selectedProfile = selectedIidxProfile;
        setIidxVersionSettings(selectedProfile?.version[selectedIidxVersionKey]);
    }, [selectedIidxVersionKey, selectedIidxProfile]);


    // TODO: use react query mutation
    const onChangeStartupArc = async (file, gameName) => {
        const formData = new FormData();
        formData.append("file", file);
        try {
            await axios.post(`${apiUrl}/${gameName.toLowerCase()}/parse_mdb/upload`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            toast(toasts.loadMetadata.success);
        } catch (e) {
            toast(toasts.loadMetadata.failure);
        }
    };

    return {
        isOnline,
        setIsOnline,
        getDdrProfilesQuery,
        getGfdmProfilesQuery,
        getIidxProfilesQuery,
        getDdrScoresByProfileIdQuery,
        getGfdmScoresByProfileIdQuery,
        getIidxScoresByProfileIdQuery,
        updateMainDDRSettingsMutation,
        updateMainGFDMSettingsMutation,
        updateMainIIDXSettingsMutation,
        onChangeStartupArc,
        saveAllDdr,
        saveAllGfdm,
        saveAllIidx,
        selectedDdrProfileId,
        setSelectedDdrProfileId,
        selectedGfdmProfileId,
        setSelectedGfdmProfileId,
        selectedIidxProfileId,
        setSelectedIidxProfileId,
        mainDDRSettings,
        setMainDDRSettings,
        mainGFDMSettings,
        setMainGFDMSettings,
        mainIIDXSettings,
        setMainIIDXSettings,
        ddrVersionKeys,
        selectedDdrVersionKey,
        setSelectedDdrVersionKey,
        ddrVersionSettings,
        setDdrVersionSettings,
        gfdmVersionKeys,
        selectedGfdmVersionKey,
        setSelectedGfdmVersionKey,
        gfdmVersionSettings,
        setGfdmVersionSettings,
        iidxVersionKeys,
        setIidxVersionKeys,
        iidxVersionSettings,
        setIidxVersionSettings,
        selectedIidxVersionKey,
        setSelectedIidxVersionKey,
        selectedGame,
        setSelectedGame,
        ddrJson,
        gfdmJson,
        iidxMusicById,
        iidxNotecountsJson,
    };
}

export default useGlobalData