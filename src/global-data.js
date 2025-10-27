import { useToast } from '@chakra-ui/react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { prepareVersionSettings } from './helpers';

function useGlobalData() {
    const queryClient = useQueryClient()
    const [isOnline, setIsOnline] = useState(null);
    const [settings, setSettings] = useState(null);
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
    const [iidxJson, setIidxJson] = useState(null);
    const [iidxNotecountsJson, setIidxNotecountsJson] = useState(null);

    const [selectedGame, setSelectedGame] = useState('DDR')

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
            getScoresByProfileId: () => axios.get(`${apiUrl}/ddr/scores/${selectedDdrProfileId}`),
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
        { ...disableRetry, onSuccess: res => setSettings(res.data.settings), enabled: !!apiUrl }
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

    useQuery(
        ["fetchIidxJson"],
        () => API.settings.getIidxJson(),
        { ...disableRetry, onSuccess: res => setIidxJson(res.data), }
    );

    useQuery(
        ["fetchIidxNotecountJson"],
        () => API.settings.getIidxNotecountsJson(),
        { ...disableRetry, onSuccess: res => setIidxNotecountsJson(res.data), enabled: true }
    );

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

    // DDR
    const getDdrScoresByProfileIdQuery = useQuery(
        ["getDdrScoresByProfileId", selectedDdrProfileId],
        () => API.ddr.getScoresByProfileId(selectedDdrProfileId),
        {
            ...disableRetry,
            enabled: !!selectedDdrProfileId && !!apiUrl,
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
        { ...disableRetry, enabled: !!apiUrl }
    );

    const getIidxScoresByProfileIdQuery = useQuery(
        ["getIidxScoresByProfileId", selectedIidxProfileId],
        () => axios.get(`${apiUrl}/iidx/scores/${selectedIidxProfileId}`),
        { ...disableRetry, enabled: !!selectedIidxProfileId && !!apiUrl }
    );

    const getSelectedDdrProfileById = (profileId) =>
        getDdrProfilesQuery?.data?.data?.find(
            (profile) => profile.ddr_id === parseInt(profileId)
        );

    const getSelectedGfdmProfileById = (profileId) =>
        getGfdmProfilesQuery?.data?.data?.find(
            (profile) => profile.gitadora_id === parseInt(profileId)
        );

    const getSelectedIidxProfileById = (profileId) =>
        getIidxProfilesQuery?.data?.data?.find(
            (profile) => profile.iidx_id === parseInt(profileId)
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
        if (!selectedDdrProfileId) return;

        setSelectedDdrVersionKey(null);
        const selectedProfile = getSelectedDdrProfileById(selectedDdrProfileId);

        if (!selectedProfile) return;

        const versionObjectKeys = Object.keys(selectedProfile.version);
        if (!versionObjectKeys.length) return;
        setDdrVersionKeys(versionObjectKeys.map((v) => parseInt(v)));

        setMainDDRSettings({
            pin: selectedProfile.pin,
            card: selectedProfile.card,
        });
    }, [selectedDdrProfileId]);

    // GFDM - if a profile is selected, get all its versions and settings    
    useEffect(() => {
        if (!selectedGfdmProfileId) return;

        setSelectedGfdmVersionKey(null);
        const selectedProfile = getSelectedGfdmProfileById(selectedGfdmProfileId);

        if (!selectedProfile) return;

        const versionObjectKeys = Object.keys(selectedProfile.version);
        if (!versionObjectKeys.length) return;
        setGfdmVersionKeys(versionObjectKeys.map((v) => parseInt(v)));

        setMainGFDMSettings({
            pin: selectedProfile.pin,
            card: selectedProfile.card,
        });
    }, [selectedGfdmProfileId]);

    // IIDX - if a profile is selected, get all its versions and settings    
    useEffect(() => {
        if (!selectedIidxProfileId) return;
        setSelectedIidxVersionKey(null);
        const selectedProfile = getSelectedIidxProfileById(selectedIidxProfileId);
        if (!selectedProfile) return;

        const versionObjectKeys = Object.keys(selectedProfile.version);
        if (!versionObjectKeys.length) return;
        setIidxVersionKeys(versionObjectKeys.map((v) => parseInt(v)));

        setMainIIDXSettings({
            pin: selectedProfile.pin,
            card: selectedProfile.card,
        });
    }, [selectedIidxProfileId]);

    // Set default version key to latest if the data exists
    useEffect(() => {
        if (ddrVersionKeys?.length > 0) {
            const defaultVersionKey = Math.max(...ddrVersionKeys);
            setSelectedDdrVersionKey(`${defaultVersionKey}`);
        }
    }, [ddrVersionKeys]);

    useEffect(() => {
        if (gfdmVersionKeys?.length > 0) {
            const defaultVersionKey = Math.max(...gfdmVersionKeys);
            setSelectedGfdmVersionKey(`${defaultVersionKey}`);
        }
    }, [gfdmVersionKeys]);

    useEffect(() => {
        if (iidxVersionKeys?.length > 0) {
            const defaultVersionKey = Math.max(...iidxVersionKeys);
            setSelectedIidxVersionKey(`${defaultVersionKey}`);
        }
    }, [iidxVersionKeys]);


    // DDR
    useEffect(() => {
        if (!selectedDdrVersionKey) return;
        const selectedProfile = getSelectedDdrProfileById(selectedDdrProfileId);
        setDdrVersionSettings(selectedProfile?.version[selectedDdrVersionKey]);
    }, [selectedDdrVersionKey]);

    // GFDM
    useEffect(() => {
        if (!selectedGfdmVersionKey) return;
        const selectedProfile = getSelectedGfdmProfileById(selectedGfdmProfileId);
        setGfdmVersionSettings(selectedProfile?.version[selectedGfdmVersionKey]);
    }, [selectedGfdmVersionKey]);

    // IIDX
    useEffect(() => {
        if (!selectedIidxVersionKey) return;
        const selectedProfile = getSelectedIidxProfileById(selectedIidxProfileId);
        setIidxVersionSettings(selectedProfile?.version[selectedIidxVersionKey]);
    }, [selectedIidxVersionKey]);


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
        iidxJson,
        iidxNotecountsJson,
    };
}

export default useGlobalData