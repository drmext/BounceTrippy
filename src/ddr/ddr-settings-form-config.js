import { Flex, Input, Select, Switch } from "@chakra-ui/react";
import { addDashToId, buildOptions, fromOnOff, parseCommon, patchCommonWithName, toOnOff } from "../helpers";

const dropdownOptions = {
  arrow_skin: ["Normal", "X", "Classic", "Cyber", "Medium", "Small", "Dot"],
  filter: ["Off", "Dark", "Darker", "Darkest"],
  guideline: ["Off", "Border", "Center"],
  priority: ["Judgment", "Arrow"],
  character: [
    { label: "All Random", value: "All Character Random" },
    { label: "Man Random", value: "Man Random" },
    { label: "Woman Random", value: "Female Random" },
    "Yuni",
    "Rage",
    "Afro",
    "Jenny",
    "Emi",
    "Baby-Lon",
    "Gus",
    "Ruby",
    "Alice",
    "Julio",
    "Bonnie",
    "Zero",
    "Rinon",
  ],
};

const rivalKeys = ["rival_1_ddr_id", "rival_2_ddr_id", "rival_3_ddr_id"];

const SettingsSelect = ({ value, optionValues, optionLabels, ...props }) => {
  return (
    <Select value={value} {...props}>
      {buildOptions(optionValues, optionLabels)}
    </Select>
  );
};

const filterRivalIds = ({ profileIds, currentRivalKey, ddrVersionSettings, profiles, selectedDdrVersionKey, selectedDdrProfileId }) => {
  const otherRivalKeys = rivalKeys?.filter((key) => key !== currentRivalKey);

  const alreadySelectedRivalIds = otherRivalKeys?.map(
    (key) => ddrVersionSettings?.[key]
  );

  const profilesWithoutCurrentVersion = profiles
    ?.filter((p) => !Object.keys(p.version).includes(selectedDdrVersionKey))
    ?.map((p) => p.ddr_id);

  // cant be yours
  // cant be already selected
  // must have the same version as currently selected

  const filteredRivalIds = profileIds?.filter(
    (id) =>
      ![
        ...alreadySelectedRivalIds,
        ...profilesWithoutCurrentVersion,
        parseInt(selectedDdrProfileId),
      ].includes(id)
  );
  return filteredRivalIds;
};

const getNameFromProfileIdAndVersionKey = (profiles, profileId, versionKey) => {
  const profile = profiles.find((p) => p.ddr_id === profileId);
  const profileVersion = profile?.version?.[versionKey];
  return parseCommon(profileVersion?.common)?.name;
};


const ddrSettingsFormConfig = ({ setSelectedDdrVersionKey, selectedDdrVersionKey, ddrVersionKeys, ddrVersionSettings, setDdrVersionSettingsParam, profileIds, profiles, smallInputWidth, onChangeRivals, currentRivalKey, selectedDdrProfileId }) => ([
  {
    label: "Version",
    formInput: (
      <Flex>
        <SettingsSelect
          onChange={(e) => setSelectedDdrVersionKey(`${e.target.value}`)}
          value={selectedDdrVersionKey}
          optionValues={ddrVersionKeys}
        />
      </Flex>
    ),
  },
  {
    label: "Name",
    formInput: (
      <Input
        value={parseCommon(ddrVersionSettings?.common)?.name}
        maxLength={8}
        onChange={(e) =>
          setDdrVersionSettingsParam(
            patchCommonWithName(ddrVersionSettings?.common, e.target.value),
            "common"
          )
        }
      />
    ),
  },
  {
    label: "Arrow Skin",
    formInput: (
      <SettingsSelect
        value={ddrVersionSettings?.arrow_skin}
        optionValues={dropdownOptions.arrow_skin}
        onChange={(e) =>
          setDdrVersionSettingsParam(e.target.value, "arrow_skin")
        }
      />
    ),
  },
  {
    label: "Filter",
    formInput: (
      <SettingsSelect
        value={ddrVersionSettings?.filter}
        optionValues={dropdownOptions.filter}
        onChange={(e) => setDdrVersionSettingsParam(e.target.value, "filter")}
      />
    ),
  },
  {
    label: "Guideline",
    formInput: (
      <SettingsSelect
        value={ddrVersionSettings?.guideline}
        optionValues={dropdownOptions.guideline}
        onChange={(e) => setDdrVersionSettingsParam(e.target.value, "guideline")}
      />
    ),
  },
  {
    label: "Priority",
    formInput: (
      <SettingsSelect
        value={ddrVersionSettings?.priority}
        optionValues={dropdownOptions.priority}
        onChange={(e) => setDdrVersionSettingsParam(e.target.value, "priority")}
      />
    ),
  },
  {
    label: "Character",
    formInput: (
      <SettingsSelect
        value={ddrVersionSettings?.character}
        optionValues={dropdownOptions.character}
        onChange={(e) => setDdrVersionSettingsParam(e.target.value, "character")}
      />
    ),
  },
  {
    label: "Timing Display",
    formInput: (
      <Switch
        colorScheme="red"
        isChecked={fromOnOff(ddrVersionSettings?.timing_disp)}
        optionValues={dropdownOptions.timing_disp}
        onChange={(e) =>
          setDdrVersionSettingsParam(toOnOff(e.target.checked), "timing_disp")
        }
      />
    ),
  },
  {
    label: "Display Calories",
    formInput: (
      <Switch
        colorScheme="red"
        isChecked={fromOnOff(ddrVersionSettings?.calories_disp)}
        optionValues={dropdownOptions.calories_disp}
        onChange={(e) =>
          setDdrVersionSettingsParam(toOnOff(e.target.checked), "calories_disp")
        }
      />
    ),
  },
  {
    label: "Rivals",
    formInput: (
      <>
        {rivalKeys.map((currentRivalKey, i) => (
          <SettingsSelect
            value={ddrVersionSettings?.[currentRivalKey] || ""}
            optionValues={filterRivalIds({ profileIds, currentRivalKey, ddrVersionSettings, profiles, selectedDdrVersionKey, selectedDdrProfileId })}
            optionLabels={filterRivalIds({ profileIds, currentRivalKey, ddrVersionSettings, profiles, selectedDdrVersionKey, selectedDdrProfileId })?.map(
              (id) =>
                `${addDashToId(id)} - ${getNameFromProfileIdAndVersionKey(
                  profiles,
                  id,
                  selectedDdrVersionKey
                )}`
            )}
            placeholder="None"
            disabled={i > 0 && !ddrVersionSettings?.[`rival_${i}_ddr_id`]}
            onChange={(e) => onChangeRivals(e.target.value, currentRivalKey)}
            w={smallInputWidth}
          />
        ))}
      </>
    ),
  },
]);

export {
  dropdownOptions,
  rivalKeys,
  ddrSettingsFormConfig
}