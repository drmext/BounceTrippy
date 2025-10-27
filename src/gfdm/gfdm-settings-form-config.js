import { Flex, Input, Select, Switch } from "@chakra-ui/react";
import { addDashToId, buildOptions} from "../helpers";

const SettingsSelect = ({ value, optionValues, optionLabels, ...props }) => {
  return (
    <Select value={value} {...props}>
      {buildOptions(optionValues, optionLabels)}
    </Select>
  );
};


const rivalKeys = [0, 1, 2, 3, 4]


 
const filterRivalIds = ({ rivalIdValues,  selectedGfdmProfileId }) => rivalIdValues?.filter(
    (id) =>
      ![

        parseInt(selectedGfdmProfileId),
      ].includes(id)
  );





const getNameFromProfileIdAndVersionKey = (profiles, profileId, versionKey) => {
  const profile = profiles.find((p) => p.gitadora_id === profileId);
  const profileVersion = profile?.version?.[versionKey];
  return profileVersion?.name;
};

const gfdmSettingsFormConfig = ({ setSelectedGfdmVersionKey, selectedGfdmVersionKey, gfdmVersionKeys, gfdmVersionSettings, setGfdmVersionSettingsParam, profileIds, cardIds, profiles, smallInputWidth, currentRivalKey, selectedGfdmProfileId, onChangeRivals }) => ([
  {
    label: "Version",
    formInput: (
      <Flex>
        <SettingsSelect
          onChange={(e) => setSelectedGfdmVersionKey(`${e.target.value}`)}
          value={selectedGfdmVersionKey}
          optionValues={gfdmVersionKeys}
        />
      </Flex>
    ),
  },
  {
    label: "Name",
    formInput: (
      <Input
        value={gfdmVersionSettings?.name}
        maxLength={32}
        onChange={(e) =>
          setGfdmVersionSettingsParam(e.target.value, "name")
        }
      />
    ),
  },
  {
    label: "Title",
    formInput: (
      <Input
        value={gfdmVersionSettings?.title}
        maxLength={32}
        onChange={(e) =>
          setGfdmVersionSettingsParam(e.target.value, "title")
        }
      />
    ),
  },
  {
    label: "Rivals",
    formInput: (
      <>
        {rivalKeys?.map((currentRivalKey, i) => {
          const rivalIdsExist = !!gfdmVersionSettings?.rival_card_ids
          const rivalIdLength = gfdmVersionSettings?.rival_card_ids?.length
          return (
            <SettingsSelect
              value={gfdmVersionSettings?.rival_card_ids?.[currentRivalKey] || ""}
              optionValues={filterRivalIds({ rivalIdValues: cardIds, currentRivalKey, gfdmVersionSettings, profiles, selectedGfdmVersionKey, selectedGfdmProfileId })}
              optionLabels={filterRivalIds({ rivalIdValues: profileIds, currentRivalKey, gfdmVersionSettings, profiles, selectedGfdmVersionKey, selectedGfdmProfileId })?.map(
                (id) =>
                  `${addDashToId(id)} - ${getNameFromProfileIdAndVersionKey(
                    profiles,
                    id,
                    selectedGfdmVersionKey
                  )}`
              )}
              placeholder="None"
              disabled={i > 0 && !rivalIdsExist || rivalIdLength < i}
              onChange={(e) => onChangeRivals(e.target.value, currentRivalKey)}
              w={smallInputWidth}
            />
          )
        })}
      </>
    ),
  },
]);

export {
  gfdmSettingsFormConfig
}