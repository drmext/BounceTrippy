import React, { useEffect } from 'react'
import { Box, Button, Divider, Heading, Input, Select, Text, VStack } from "@chakra-ui/react";
import { gfdmSettingsFormConfig } from "./gfdm-settings-form-config";
import { addDashToId } from "../helpers";

const GfdmProfilesSidebar = ({
    saveAllGfdm,
    newPin,
    setNewPin,
    profiles,
    newCard,
    setNewCard,
    setSelectedGfdmProfileIdHandler,
    selectedGfdmProfileId,
    gfdmVersionKeys,
    gfdmVersionSettings,
    setGfdmVersionSettings,
    selectedGfdmVersionKey,
    setSelectedGfdmVersionKey,
    savingInProgress,
}) => {
    const profileIds = profiles?.map(profile => profile?.gitadora_id) || [] // Hi

    const cardIds = profiles?.map(profile => profile?.card) || [] // Hi

    const setGfdmVersionSettingsParam = (value, paramName) => {
        setGfdmVersionSettings((prev) => ({
            ...prev,
            [paramName]: value,
        }));
    };

    const smallInputWidth = "6.6rem";

    const onChangeRivals = (value, rivalIndex) => {

        setGfdmVersionSettings((prev) => {

            // if its null, make an empty array
            let newRivalCardIds = !Array.isArray(prev.rival_card_ids) ? [] : JSON.parse(JSON.stringify(prev.rival_card_ids))

            if (value) {
                // if updating a value and the array index position already exists, mutate 
                if (newRivalCardIds[rivalIndex]) {
                    return ({
                        ...prev,
                        rival_card_ids: newRivalCardIds[rivalIndex] = value,
                    })
                } else {
                    // if the array index position doesnt exist, assume we need to append
                    newRivalCardIds.push(value)
                    return ({
                        ...prev,
                        rival_card_ids: newRivalCardIds,
                    })
                }


            }
            // if removing the one and only item, initialize an empty array
            if (newRivalCardIds.length === 1) {
                return ({
                    ...prev,
                    rival_card_ids: []
                })
            } else {
                return ({
                    ...prev,
                    rival_card_ids: newRivalCardIds.filter(id => id !== newRivalCardIds[rivalIndex])
                })
            }

        });
    }



    const profilesSection = <Box w={"100%"} fontSize="0.75rem">
        <Box mb="0.5rem">
            <Text>ID</Text>
            <Select
                placeholder={"Select a Profile"}
                onChange={(e) => setSelectedGfdmProfileIdHandler(e.target.value)}
                w={!selectedGfdmProfileId ? "100%" : smallInputWidth}
            >
                {profileIds?.map((profileId) => (
                    <option
                        style={{ height: "2rem" }}
                        label={`${addDashToId(profileId)} - ${profiles.find((p) => p.gitadora_id === profileId)?.card
                            }`}
                        value={profileId}
                        key={`profile-${profileId}`}
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

    return (
        <>
            <Heading size="md" textAlign="left" mb="0.5rem">
                Profile
            </Heading>
            {profilesSection}
            <VStack fontSize="0.75rem" width="10rem">
                <br />
                {/* Main DDR Settings */}

                {!selectedGfdmProfileId
                    ? null
                    : gfdmSettingsFormConfig({
                        setSelectedGfdmVersionKey, selectedGfdmVersionKey, gfdmVersionKeys, gfdmVersionSettings, setGfdmVersionSettingsParam, profileIds, cardIds, profiles, smallInputWidth, selectedGfdmProfileId, onChangeRivals
                    }).map((setting) => (
                        <Box w={"100%"}>
                            <Text>{setting.label}</Text>
                            {setting.formInput}
                        </Box>
                    ))}
                <br />
                <br />
                <Button
                    onClick={saveAllGfdm}
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

export default GfdmProfilesSidebar