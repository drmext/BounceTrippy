import { Box, Button, Divider, Heading, HStack, IconButton, Input, Select, Text, Tooltip, VStack } from "@chakra-ui/react";
import { rivalKeys, ddrSettingsFormConfig } from "./ddr-settings-form-config";
import { addDashToId } from "../helpers";

const DdrProfilesSidebar = ({
    saveAllDdr,
    newPin,
    setNewPin,
    profiles,
    newCard,
    setNewCard,
    setSelectedDdrProfileIdHandler,
    selectedDdrProfileId,
    ddrVersionKeys,
    ddrVersionSettings,
    setDdrVersionSettings,
    selectedDdrVersionKey,
    setSelectedDdrVersionKey,
    savingInProgress,
}) => {

    const profileIds = profiles?.map(profile => profile?.ddr_id) || []

    const setDdrVersionSettingsParam = (value, paramName) => {
        setDdrVersionSettings((prev) => ({
            ...prev,
            [paramName]: value,
        }));
    };

    const onChangeRivals = (value, rivalKey) => {
        if (value !== "") {
            setDdrVersionSettingsParam(parseInt(value), rivalKey);
            return;
        }

        const emptyRivalValue = 0;

        const rivalResetConfig = {
            rival_1_ddr_id: () => {
                setDdrVersionSettingsParam(emptyRivalValue, rivalKeys[2]);
                setDdrVersionSettingsParam(ddrVersionSettings[rivalKeys[2]], rivalKeys[1]);
                setDdrVersionSettingsParam(ddrVersionSettings[rivalKeys[1]], rivalKeys[0]);
            },
            rival_2_ddr_id: () => {
                setDdrVersionSettingsParam(emptyRivalValue, rivalKeys[2]);
                setDdrVersionSettingsParam(ddrVersionSettings[rivalKeys[2]], rivalKeys[1]);
            },
            rival_3_ddr_id: () => {
                setDdrVersionSettingsParam(emptyRivalValue, rivalKeys[2]);
            },
        };

        rivalResetConfig[rivalKey]();
    };

    const smallInputWidth = "6.6rem";


    const profilesSection = <Box w={"100%"} fontSize="0.75rem">
        <Box mb="0.5rem">
            <Text>ID</Text>
            <HStack spacing={1} w="100%">
                <Select
                    value={selectedDdrProfileId ?? ""}
                    onChange={(e) => setSelectedDdrProfileIdHandler(e.target.value)}
                    w={!selectedDdrProfileId ? "100%" : smallInputWidth}
                    placeholder="Select a Profile"
                >
                    {profileIds?.map((profileId) => (
                        <option
                            style={{ height: "2rem" }}
                            label={`${addDashToId(profileId)} - ${profiles.find((p) => p.ddr_id === profileId)?.card
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
                maxLength={16}
                onChange={(e) => setNewCard(e.target.value)}
            // style={{ fontSize: "0.75rem" }}
            />
        </Box>
        <Box mb="0.5rem">
            <Text>Pin</Text>
            <Input
                value={newPin}
                type="password"
                maxLength={4}
                onChange={(e) => setNewPin(e.target.value)}
            />
        </Box>
        {selectedDdrProfileId ? (
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
                {selectedDdrProfileId ? (
                    <Tooltip label="Deselect" hasArrow placement="top">
                        <IconButton
                            aria-label="Deselect profile"
                            size="xs"
                            variant="ghost"
                            minW="1.5rem"
                            w="1.5rem"
                            h="1.5rem"
                            onClick={() => setSelectedDdrProfileIdHandler("")}
                            icon={<Box as="span" lineHeight="1" fontSize="0.8rem">✕</Box>}
                        />
                    </Tooltip>
                ) : null}
            </HStack>
            {profilesSection}
            <VStack fontSize="0.75rem" width="10rem">
                <br />
                {/* Main DDR Settings */}

                {!selectedDdrProfileId
                    ? null
                    : ddrSettingsFormConfig({
                        setSelectedDdrVersionKey, selectedDdrVersionKey, ddrVersionKeys, ddrVersionSettings, setDdrVersionSettingsParam, profileIds, profiles, smallInputWidth, onChangeRivals, selectedDdrProfileId
                    }).map((setting) => (
                        <Box w={"100%"}>
                            <Text>{setting.label}</Text>
                            {setting.formInput}
                        </Box>
                    ))}
                <br />
                <br />
                {!selectedDdrProfileId ? null : (
                    <Button
                        onClick={saveAllDdr}
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
                )}
            </VStack>
            <br />
            <br />
        </>
    );
};

export default DdrProfilesSidebar