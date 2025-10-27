import { Box, Button, Divider, Heading, Input, Select, Text, VStack } from "@chakra-ui/react";
import { addDashToId } from "../helpers";
import { rivalKeysSP, rivalKeysDP, iidxSettingsFormConfig } from "./iidx-settings-form-config";

const IidxProfilesSection = ({
    saveAll,
    newPin,
    setNewPin,
    profiles,
    newCard,
    setNewCard,
    selectedProfileId,
    setSelectedProfileId,
    versionKeys,
    versionSettings,
    setVersionSettings,
    selectedVersionKey,
    setSelectedVersionKey,
    savingInProgress,
}) => {

    const profileIds = profiles?.map(profile => profile?.iidx_id) || []

    const setVersionSettingsParam = (value, paramName) => {
        setVersionSettings((prev) => ({
            ...prev,
            [paramName]: value,
        }));
    };

    const onChangeRivalsSP = (value, rivalKeySP) => {

        if (value !== "") {
            setVersionSettingsParam(parseInt(value), rivalKeySP);
            return;
        }

        const emptyRivalValueSP = 0;

        const rivalResetConfigSP = {
            sp_rival_1_iidx_id: () => {
                setVersionSettingsParam(emptyRivalValueSP, rivalKeysSP[5]);
                setVersionSettingsParam(versionSettings[rivalKeysSP[5]], rivalKeysSP[4]);
                setVersionSettingsParam(versionSettings[rivalKeysSP[4]], rivalKeysSP[3]);
                setVersionSettingsParam(versionSettings[rivalKeysSP[3]], rivalKeysSP[2]);
                setVersionSettingsParam(versionSettings[rivalKeysSP[2]], rivalKeysSP[1]);
                setVersionSettingsParam(versionSettings[rivalKeysSP[1]], rivalKeysSP[0]);
            },
            sp_rival_2_iidx_id: () => {
                setVersionSettingsParam(emptyRivalValueSP, rivalKeysSP[5]);
                setVersionSettingsParam(versionSettings[rivalKeysSP[5]], rivalKeysSP[4]);
                setVersionSettingsParam(versionSettings[rivalKeysSP[4]], rivalKeysSP[3]);
                setVersionSettingsParam(versionSettings[rivalKeysSP[3]], rivalKeysSP[2]);
                setVersionSettingsParam(versionSettings[rivalKeysSP[2]], rivalKeysSP[1]);
            },
            sp_rival_3_iidx_id: () => {
                setVersionSettingsParam(emptyRivalValueSP, rivalKeysSP[5]);
                setVersionSettingsParam(versionSettings[rivalKeysSP[5]], rivalKeysSP[4]);
                setVersionSettingsParam(versionSettings[rivalKeysSP[4]], rivalKeysSP[3]);
                setVersionSettingsParam(versionSettings[rivalKeysSP[3]], rivalKeysSP[2]);
            },
            sp_rival_4_iidx_id: () => {
                setVersionSettingsParam(emptyRivalValueSP, rivalKeysSP[5]);
                setVersionSettingsParam(versionSettings[rivalKeysSP[5]], rivalKeysSP[4]);
                setVersionSettingsParam(versionSettings[rivalKeysSP[4]], rivalKeysSP[3]);
            },
            sp_rival_5_iidx_id: () => {
                setVersionSettingsParam(emptyRivalValueSP, rivalKeysSP[5]);
                setVersionSettingsParam(versionSettings[rivalKeysSP[5]], rivalKeysSP[4]);
            },
            sp_rival_6_iidx_id: () => {
                setVersionSettingsParam(emptyRivalValueSP, rivalKeysSP[5]);
            },
        };

        rivalResetConfigSP[rivalKeySP]();
    };

    const onChangeRivalsDP = (value, rivalKeyDP) => {
        if (value !== "") {
            setVersionSettingsParam(parseInt(value), rivalKeyDP);
            return;
        }

        const emptyRivalValueDP = 0;

        const rivalResetConfigDP = {
            dp_rival_1_iidx_id: () => {
                setVersionSettingsParam(emptyRivalValueDP, rivalKeysDP[5]);
                setVersionSettingsParam(versionSettings[rivalKeysDP[5]], rivalKeysDP[4]);
                setVersionSettingsParam(versionSettings[rivalKeysDP[4]], rivalKeysDP[3]);
                setVersionSettingsParam(versionSettings[rivalKeysDP[3]], rivalKeysDP[2]);
                setVersionSettingsParam(versionSettings[rivalKeysDP[2]], rivalKeysDP[1]);
                setVersionSettingsParam(versionSettings[rivalKeysDP[1]], rivalKeysDP[0]);
            },
            dp_rival_2_iidx_id: () => {
                setVersionSettingsParam(emptyRivalValueDP, rivalKeysDP[5]);
                setVersionSettingsParam(versionSettings[rivalKeysDP[5]], rivalKeysDP[4]);
                setVersionSettingsParam(versionSettings[rivalKeysDP[4]], rivalKeysDP[3]);
                setVersionSettingsParam(versionSettings[rivalKeysDP[3]], rivalKeysDP[2]);
                setVersionSettingsParam(versionSettings[rivalKeysDP[2]], rivalKeysDP[1]);
            },
            dp_rival_3_iidx_id: () => {
                setVersionSettingsParam(emptyRivalValueDP, rivalKeysDP[5]);
                setVersionSettingsParam(versionSettings[rivalKeysDP[5]], rivalKeysDP[4]);
                setVersionSettingsParam(versionSettings[rivalKeysDP[4]], rivalKeysDP[3]);
                setVersionSettingsParam(versionSettings[rivalKeysDP[3]], rivalKeysDP[2]);
            },
            dp_rival_4_iidx_id: () => {
                setVersionSettingsParam(emptyRivalValueDP, rivalKeysDP[5]);
                setVersionSettingsParam(versionSettings[rivalKeysDP[5]], rivalKeysDP[4]);
                setVersionSettingsParam(versionSettings[rivalKeysDP[4]], rivalKeysDP[3]);
            },
            dp_rival_5_iidx_id: () => {
                setVersionSettingsParam(emptyRivalValueDP, rivalKeysDP[5]);
                setVersionSettingsParam(versionSettings[rivalKeysDP[5]], rivalKeysDP[4]);
            },
            dp_rival_6_iidx_id: () => {
                setVersionSettingsParam(emptyRivalValueDP, rivalKeysDP[5]);
            },
        };

        rivalResetConfigDP[rivalKeyDP]();
    };

    const smallInputWidth = "6.6rem";

    return (
        <>
            <Heading size="md" textAlign="left" mb="0.5rem">Profile</Heading>

            <VStack fontSize="0.75rem" width="10rem">
                <br />
                {/* Main DDR Settings */}
                <Box w={"100%"}>
                    <Box mb="0.5rem">
                        <Text>ID</Text>
                        <Select
                            placeholder={"Select a Profile"}
                            onChange={(e) => setSelectedProfileId(e.target.value)}
                            w={!selectedProfileId ? "100%" : smallInputWidth}
                        >
                            {profileIds?.map((profileId) => (
                                <option
                                    style={{ height: "2rem" }}
                                    label={`${addDashToId(profileId)} - ${profiles.find((p) => p.iidx_id === profileId)?.card
                                        }`}
                                    value={profileId}
                                ></option>
                            ))}
                        </Select>
                    </Box>
                    <Box mb="0.5rem">
                        <Text>Card</Text>
                        <Input
                            value={newCard}
                            onChange={(e) => setNewCard(e.target.value)}
                        // style={{ fontSize: "0.75rem" }}
                        />
                    </Box>
                    <Box mb="0.5rem">
                        <Text>Pin</Text>
                        <Input
                            value={newPin}
                            type="password"
                            onChange={(e) => setNewPin(e.target.value)}
                        />
                    </Box>
                    <br />
                    <Divider />
                    <br />
                </Box>
                {!selectedProfileId
                    ? null
                    : iidxSettingsFormConfig({
                        setSelectedVersionKey, selectedVersionKey, versionKeys, versionSettings, setVersionSettingsParam, profileIds, profiles, smallInputWidth, onChangeRivalsSP, onChangeRivalsDP, selectedProfileId
                    }).map((setting) => (
                        <Box w={"100%"}>
                            <Text>{setting.label}</Text>
                            {setting.formInput}
                        </Box>
                    ))}
                <br />
                <br />
                <Button
                    onClick={saveAll}
                    width="100%"
                    size="sm"
                    //color="white"
                    //backgroundColor="#f00"
                    variant="save"
                    // textShadow="-1px -1px 0 #f00, 1px -1px 0 #f00, -1px 1px 0 #f00, 1px 1px 0 #f00"
                    //outline="0.5px solid #f00"
                    //textStroke="2px #f00"
                    disabled={savingInProgress}
                >
                    Save Settings
                </Button>
            </VStack>
            <br />
            <br />
        </>
    );
};

export default IidxProfilesSection