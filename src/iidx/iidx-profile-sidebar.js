import { Box, Button, Divider, Heading, HStack, IconButton, Input, Select, Text, Tooltip, VStack } from "@chakra-ui/react";
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

    const profilesSection = <Box w={"100%"} fontSize="0.75rem">
        <Box mb="0.5rem">
            <Text>ID</Text>
            <HStack spacing={1} w="100%">
                <Select
                    value={selectedProfileId ?? ""}
                    onChange={(e) => setSelectedProfileId(e.target.value)}
                    w={!selectedProfileId ? "100%" : smallInputWidth}
                    placeholder="Select a Profile"
                >
                    {profileIds?.map((profileId) => (
                        <option
                            style={{ height: "2rem" }}
                            label={`${addDashToId(profileId)} - ${profiles.find((p) => p.iidx_id === profileId)?.card
                                }`}
                            value={profileId}
                            key={`profile-${profileId}`}
                        ></option>
                    ))}
                </Select>
            </HStack>
        </Box>
        <Box mb="0.5rem">
            <Text>Card</Text>
            <Input
                value={newCard}
                onChange={(e) => setNewCard(e.target.value)}
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
        {selectedProfileId ? (
            <>
                <br />
                <Divider />
                <br />
            </>
        ) : null}
    </Box>

    return (
        <>
            <HStack align="center" spacing={1} mb="0.5rem">
                <Heading size="md" textAlign="left">
                    Profile
                </Heading>
                {selectedProfileId ? (
                    <Tooltip label="Deselect" hasArrow placement="top">
                        <IconButton
                            aria-label="Deselect profile"
                            size="xs"
                            variant="ghost"
                            minW="1.5rem"
                            w="1.5rem"
                            h="1.5rem"
                            onClick={() => setSelectedProfileId("")}
                            icon={<Box as="span" lineHeight="1" fontSize="0.8rem">✕</Box>}
                        />
                    </Tooltip>
                ) : null}
            </HStack>
            {profilesSection}

            <VStack fontSize="0.75rem" width="10rem">
                <br />
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
                {!selectedProfileId ? null : (
                    <Button
                        onClick={saveAll}
                        width="100%"
                        size="sm"
                        variant="save"
                        disabled={savingInProgress}
                    >
                        Save Settings
                    </Button>
                )}
            </VStack>
            <br />
            <br />
        </>
    );
};

export default IidxProfilesSection