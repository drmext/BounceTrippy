import React from "react";
import { Flex, Input, Select, Switch, Text } from "@chakra-ui/react";
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

  // Allow rivals across *any* DDR version (19/20/etc).
  // Still avoid duplicates by operating on unique `ddr_id`s (one entry per profile).
  const uniqueProfileIds = Array.from(new Set(profileIds || []));

  // cant be yours
  // cant be already selected

  const filteredRivalIds = uniqueProfileIds?.filter(
    (id) =>
      ![
        ...alreadySelectedRivalIds,
        parseInt(selectedDdrProfileId),
      ].includes(id)
  );
  return filteredRivalIds;
};

const getNameFromProfileIdAndVersionKey = (profiles, profileId, versionKey) => {
  const profile = profiles.find((p) => p.ddr_id === profileId);
  const profileVersion = profile?.version?.[versionKey];
  if (`${versionKey}` === "20") {
    return profileVersion?.common_dancername || parseCommon(profileVersion?.common)?.name || "??";
  }
  return parseCommon(profileVersion?.common)?.name || "??";
};

const CustomizeDropdownEditor = ({ customize, onChangeCustomize }) => {
  const current = customize && typeof customize === "object" ? customize : {};
  const topKeys = Object.keys(current).length ? Object.keys(current) : ["1", "2", "3", "4", "5", "6", "7", "8"];

  const customizeLabels = {
    "1": { "0": "Appeal Board" },
    "2": { "1": "Character (Left)", "2": "Character (Right)" },
    "3": { "1": "Game Background (System)", "2": "Game Background (Play)" },
    "4": { "0": "Lane Background (Single)" },
    "5": { "0": "Lane Background (Double)" },
    "6": { "0": "Lane Cover (Single)" },
    "7": { "0": "Lane Cover (Double)" },
    "8": { "0": "Song Video" },
  };

  const setNested = (groupKey, itemKey, nextValue) => {
    const prevGroup = current?.[groupKey] && typeof current[groupKey] === "object" ? current[groupKey] : {};
    const nextGroup = { ...prevGroup, [itemKey]: nextValue };
    const nextCustomize = { ...current, [groupKey]: nextGroup };
    onChangeCustomize(nextCustomize);
  };

  return (
    <Flex direction="column" gap={2}>
      {topKeys.map((groupKey) => {
        const group = current?.[groupKey] && typeof current[groupKey] === "object" ? current[groupKey] : {};
        const itemKeys = Object.keys(group).length
          ? Object.keys(group)
          : Object.keys(customizeLabels?.[groupKey] || {}).length
            ? Object.keys(customizeLabels[groupKey])
            : ["0"];
        return (
          <Flex key={`customize-group-${groupKey}`} direction="column" gap={1}>
            <Flex wrap="wrap" gap={2}>
              {itemKeys.map((itemKey) => (
                <Flex key={`customize-${groupKey}-${itemKey}`} direction="column">
                  <Text fontSize="xs" opacity={0.85}>
                    {customizeLabels?.[groupKey]?.[itemKey] || "customize"}
                  </Text>
                  <Input
                    type="number"
                    value={String(group?.[itemKey] ?? -1)}
                    onChange={(e) => setNested(groupKey, itemKey, parseInt(e.target.value || "-1"))}
                    w="6.6rem"
                    size="xs"
                  />
                </Flex>
              ))}
            </Flex>
          </Flex>
        );
      })}
    </Flex>
  );
};


const ddrSettingsFormConfig = ({ setSelectedDdrVersionKey, selectedDdrVersionKey, ddrVersionKeys, ddrVersionSettings, setDdrVersionSettingsParam, profileIds, profiles, smallInputWidth, onChangeRivals, currentRivalKey, selectedDdrProfileId }) => {
  const versionLabelMap = {
    "19": "A20P/A3",
    "20": "WORLD",
  };

  const baseVersionSetting = {
    label: "Version",
    formInput: (
      <Flex>
        <SettingsSelect
          onChange={(e) => setSelectedDdrVersionKey(`${e.target.value}`)}
          value={selectedDdrVersionKey}
          optionValues={ddrVersionKeys}
          optionLabels={(ddrVersionKeys || []).map((k) => versionLabelMap?.[`${k}`] ?? `${k}`)}
        />
      </Flex>
    ),
  };

  // DDR v20 uses different payload keys than the older versions.
  if (`${selectedDdrVersionKey}` === "20") {
    return [
      baseVersionSetting,
      {
        label: "Name",
        formInput: (
          <Input
            value={ddrVersionSettings?.common_dancername ?? ""}
            maxLength={8}
            onChange={(e) => setDdrVersionSettingsParam(e.target.value, "common_dancername")}
          />
        ),
      },
      {
        label: "Area",
        formInput: (
          <Input
            value={ddrVersionSettings?.common_area ?? ""}
            onChange={(e) => setDdrVersionSettingsParam(parseInt(e.target.value || "0"), "common_area")}
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
      {
        label: "Customize",
        formInput: (
          <CustomizeDropdownEditor
            customize={ddrVersionSettings?.customize}
            onChangeCustomize={(nextCustomize) => setDdrVersionSettingsParam(nextCustomize, "customize")}
          />
        ),
      },
    ];
  }

  return ([
    baseVersionSetting,
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
};

export {
  dropdownOptions,
  rivalKeys,
  ddrSettingsFormConfig
}