import { Flex, Input, Select, Switch } from "@chakra-ui/react";
import { addDashToId, buildOptions } from "../helpers";
import IidxOptions from "./iidx-settings.json"
import IidxQpros from "./iidx-qpros.json"
import IidxRegions from "./iidx-regions.json"


const dropdownOptions = {
  //region: new Array(53).fill(0).map((x, i) => i + 1),
  region: Object.entries(IidxRegions).map((k, v) => k[1].ja),
  head: Object.entries(IidxQpros.head).map((k, v) => k[1]),
  hair: Object.entries(IidxQpros.hair).map((k, v) => k[1]),
  face: Object.entries(IidxQpros.face).map((k, v) => k[1]),
  hand: Object.entries(IidxQpros.hand).map((k, v) => k[1]),
  body: Object.entries(IidxQpros.body).map((k, v) => k[1]),
  frame: IidxOptions.FRAME,
  turntable: IidxOptions.TURNTABLE,
  explosion: IidxOptions.EXPLOSION,
  bgm: IidxOptions.MUSICSELECTBGM,
  sudden: IidxOptions.LANECOVER,
  categoryvoice: IidxOptions.CATEGORYVOICE,
  note: IidxOptions.NOTES,
  fullcombo: IidxOptions.FULLCOMBO,
  keybeam: IidxOptions.KEYBEAM,
  judgestring: IidxOptions.JUDGESTRING,
  effector_type: [
    "OFF",
    "ECHO / REVERB",
    "COMPRESSOR / REVERB EX",
    "CHORUS / FLANGER",
    "GARGLE / DISTORTION",
    "EQ ONLY"
],
  explosion_size: [
    "100%",
    "70%",
    "80%",
    "90%",
    "110%",
    "120%",
    "130%"
],
  kokokara_start: [
    "DEFAULT",
    "ALLDISP",
    "OFF"
],
  skin_customize_flag_frame: [
    "DEFAULT"
],
  skin_customize_flag_bgm: [
    "DEFAULT"
],
  skin_customize_flag_lane: [
    "DEFAULT"
],
};

const rivalKeysSP = [
  "sp_rival_1_iidx_id",
  "sp_rival_2_iidx_id",
  "sp_rival_3_iidx_id",
  "sp_rival_4_iidx_id",
  "sp_rival_5_iidx_id",
  "sp_rival_6_iidx_id"
];

const rivalKeysDP = [
  "dp_rival_1_iidx_id",
  "dp_rival_2_iidx_id",
  "dp_rival_3_iidx_id",
  "dp_rival_4_iidx_id",
  "dp_rival_5_iidx_id",
  "dp_rival_6_iidx_id"
];

const SettingsSelect = ({ value, optionValues, optionLabels, ...props }) => {
  return (
    <Select value={value} {...props}>
      {buildOptions(optionValues, optionLabels)}
    </Select>
  );
};

const filterRivalIdsSP = ({ profileIds, currentRivalKeySP, versionSettings, profiles, selectedVersionKey, selectedProfileId }) => {
  const otherRivalKeysSP = rivalKeysSP?.filter((key) => key !== currentRivalKeySP);

  const alreadySelectedRivalIdsSP = otherRivalKeysSP?.map(
    (key) => versionSettings?.[key]
  );

  const profilesWithoutCurrentVersion = profiles
    ?.filter((p) => !Object.keys(p.version).includes(selectedVersionKey))
    ?.map((p) => p.iidx_id);

  // cant be yours
  // cant be already selected
  // must have the same version as currently selected

  const filteredRivalIdsSP = profileIds?.filter(
    (id) =>
      ![
        ...alreadySelectedRivalIdsSP,
        ...profilesWithoutCurrentVersion,
        parseInt(selectedProfileId),
      ].includes(id)
  );
  return filteredRivalIdsSP;
};

const filterRivalIdsDP = ({ profileIds, currentRivalKeyDP, versionSettings, profiles, selectedVersionKey, selectedProfileId }) => {
  const otherRivalKeysDP = rivalKeysDP?.filter((key) => key !== currentRivalKeyDP);

  const alreadySelectedRivalIdsDP = otherRivalKeysDP?.map(
    (key) => versionSettings?.[key]
  );

  const profilesWithoutCurrentVersion = profiles
    ?.filter((p) => !Object.keys(p.version).includes(selectedVersionKey))
    ?.map((p) => p.iidx_id);

  // cant be yours
  // cant be already selected
  // must have the same version as currently selected

  const filteredRivalIdsDP = profileIds?.filter(
    (id) =>
      ![
        ...alreadySelectedRivalIdsDP,
        ...profilesWithoutCurrentVersion,
        parseInt(selectedProfileId),
      ].includes(id)
  );
  return filteredRivalIdsDP;
};

const getNameFromProfileIdAndVersionKey = (profiles, profileId, versionKey) => {
  const profile = profiles.find((p) => p.iidx_id === profileId);
  const profileVersion = profile?.version?.[versionKey];
  return profileVersion?.djname;
};

const boolToInt = bool => !!bool ? 1 : 0



const iidxSettingsFormConfig = ({ setSelectedVersionKey, selectedVersionKey, versionKeys, versionSettings, setVersionSettingsParam, profileIds, profiles, smallInputWidth, onChangeRivalsSP, onChangeRivalsDP, currentRivalKeySP, currentRivalKeyDP, selectedProfileId }) => {

  const optionLookupByIndex = (optionName) => dropdownOptions?.[optionName]?.[versionSettings?.[optionName]]

  const setVersionSettingsParamByOptionIndex = (e, optionName, dropdownName) => setVersionSettingsParam(dropdownOptions[dropdownName || optionName].indexOf(e.target.value), optionName)
  return ([
    {
      label: "Version",
      formInput: (
        <Flex>
          <SettingsSelect
            onChange={(e) => setSelectedVersionKey(`${e.target.value}`)}
            value={selectedVersionKey}
            optionValues={versionKeys}
          />
        </Flex>
      ),
    },
    {
      label: "DJ Name",
      formInput: (
        <Input
          value={versionSettings?.djname}
          maxLength={8}
          onChange={(e) =>
            setVersionSettingsParam(e.target.value.toUpperCase(), "djname")
          }
        />
      ),
    },
    {
      label: "Region",
      formInput: (
        <SettingsSelect
          value={optionLookupByIndex('region')}
          optionValues={dropdownOptions.region}
          onChange={(e) =>
            setVersionSettingsParamByOptionIndex(e, "region")
          }
        />
      ),
    },
    {
      label: "Head",
      formInput: (
        <SettingsSelect
          value={optionLookupByIndex('head')}
          optionValues={dropdownOptions.head}
          onChange={(e) =>
            setVersionSettingsParamByOptionIndex(e, "head")
          }
        />
      ),
    },
    {
      label: "Hair",
      formInput: (
        <SettingsSelect
          value={optionLookupByIndex('hair')}
          optionValues={dropdownOptions.hair}
          onChange={(e) =>
            setVersionSettingsParamByOptionIndex(e, "hair")
          }
        />
      ),
    },
    {
      label: "Face",
      formInput: (
        <SettingsSelect
          value={optionLookupByIndex('face')}
          optionValues={dropdownOptions.face}
          onChange={(e) =>
            setVersionSettingsParamByOptionIndex(e, "face")
          }
        />
      ),
    },
    {
      label: "Hand",
      formInput: (
        <SettingsSelect
          value={optionLookupByIndex('hand')}
          optionValues={dropdownOptions.hand}
          onChange={(e) =>
            setVersionSettingsParamByOptionIndex(e, "hand")
          }
        />
      ),
    },
    {
      label: "Body",
      formInput: (
        <SettingsSelect
          value={optionLookupByIndex('body')}
          optionValues={dropdownOptions.body}
          onChange={(e) =>
            setVersionSettingsParamByOptionIndex(e, "body")
          }
        />
      ),
    },
    {
      label: "Frame",
      formInput: (
        <SettingsSelect
          value={optionLookupByIndex('frame')}
          optionValues={dropdownOptions.frame}
          onChange={(e) => setVersionSettingsParamByOptionIndex(e, "frame")}
        />
      ),
    },
    {
      label: "Turntable",
      formInput: (
        <SettingsSelect
          value={optionLookupByIndex('turntable')}
          optionValues={dropdownOptions.turntable}
          onChange={(e) => setVersionSettingsParamByOptionIndex(e, "turntable")}
        />
      ),
    },
    {
      label: "Explosion",
      formInput: (
        <SettingsSelect
          value={optionLookupByIndex('explosion')}
          optionValues={dropdownOptions.explosion}
          onChange={(e) => setVersionSettingsParamByOptionIndex(e, "explosion")}
        />
      ),
    },
    {
      label: "BGM",
      formInput: (
        <SettingsSelect
          value={optionLookupByIndex('bgm')}
          optionValues={dropdownOptions.bgm}
          onChange={(e) => setVersionSettingsParamByOptionIndex(e, "bgm")}
        />
      ),
    },
    {
      label: "Lane Cover",
      formInput: (
        <SettingsSelect
          value={optionLookupByIndex('sudden')}
          optionValues={dropdownOptions.sudden}
          onChange={(e) => setVersionSettingsParamByOptionIndex(e, "sudden")}
        />
      ),
    },
    {
      label: "Voice",
      formInput: (
        <SettingsSelect
          value={optionLookupByIndex('categoryvoice')}
          optionValues={dropdownOptions.categoryvoice}
          onChange={(e) => setVersionSettingsParamByOptionIndex(e, "categoryvoice")}
        />
      ),
    },
    {
      label: "Notes",
      formInput: (
        <SettingsSelect
          value={optionLookupByIndex('note')}
          optionValues={dropdownOptions.note}
          onChange={(e) => setVersionSettingsParamByOptionIndex(e, "note")}
        />
      ),
    },
    {
      label: "Full Combo Animation",
      formInput: (
        <SettingsSelect
          value={optionLookupByIndex('fullcombo')}
          optionValues={dropdownOptions.fullcombo}
          onChange={(e) => setVersionSettingsParamByOptionIndex(e, "fullcombo")}
        />
      ),
    },
    {
      label: "Key Beam",
      formInput: (
        <SettingsSelect
          value={optionLookupByIndex('keybeam')}
          optionValues={dropdownOptions.keybeam}
          onChange={(e) => setVersionSettingsParamByOptionIndex(e, "keybeam")}
        />
      ),
    },
    {
      label: "Judge Font",
      formInput: (
        <SettingsSelect
          value={optionLookupByIndex('judgestring')}
          optionValues={dropdownOptions.judgestring}
          onChange={(e) => setVersionSettingsParamByOptionIndex(e, "judgestring")}
        />
      ),
    },
    {
      label: "Graph Cover",
      formInput: (
        <SettingsSelect
          value={optionLookupByIndex('grapharea')}
          optionValues={dropdownOptions.sudden}
          onChange={(e) => setVersionSettingsParamByOptionIndex(e, "grapharea", "sudden")}
        />
      ),
    },
    {
      label: "Effector Lock",
      formInput: (
        <Switch
          colorScheme="red"
          isChecked={versionSettings?.effector_lock}
          optionValues={dropdownOptions.effector_lock}
          onChange={(e) =>
            setVersionSettingsParam(boolToInt(e.target.checked), "effector_lock")
          }
        />
      ),
    },
    {
      label: "Effector Type",
      formInput: (
        <SettingsSelect
          value={optionLookupByIndex('effector_type')}
          optionValues={dropdownOptions.effector_type}
          onChange={(e) => setVersionSettingsParamByOptionIndex(e, "effector_type")}
        />
      ),
    },
    {
      label: "Explosion Size",
      formInput: (
        <SettingsSelect
          value={optionLookupByIndex('explosion_size')}
          optionValues={dropdownOptions.explosion_size}
          onChange={(e) => setVersionSettingsParamByOptionIndex(e, "explosion_size")}
        />
      ),
    },
    {
      label: "Alternate HCN",
      formInput: (
        <Switch
          colorScheme="red"
          isChecked={!!versionSettings?.alternate_hcn}
          optionValues={dropdownOptions.alternate_hcn}
          onChange={(e) =>
            setVersionSettingsParam(boolToInt(e.target.checked), "alternate_hcn")
          }
        />
      ),
    },
    {
      label: "Kokokara Start",
      formInput: (
        <SettingsSelect
          value={optionLookupByIndex('kokokara_start')}
          optionValues={dropdownOptions.kokokara_start}
          onChange={(e) => setVersionSettingsParamByOptionIndex(e, "kokokara_start")}
        />
      ),
    },
    {
      label: "Show Category Grade",
      formInput: (
        <Switch
          colorScheme="red"
          isChecked={!!versionSettings?.show_category_grade}
          optionValues={dropdownOptions.show_category_grade}
          onChange={(e) =>
            setVersionSettingsParam(boolToInt(e.target.checked), "show_category_grade")
          }
        />
      ),
    },
    {
      label: "Show Category Status",
      formInput: (
        <Switch
          colorScheme="red"
          isChecked={!!versionSettings?.show_category_status}
          optionValues={dropdownOptions.show_category_status}
          onChange={(e) =>
            setVersionSettingsParam(boolToInt(e.target.checked), "show_category_status")
          }
        />
      ),
    },
    {
      label: "Show Category Difficulty",
      formInput: (
        <Switch
          colorScheme="red"
          isChecked={!!versionSettings?.show_category_difficulty}
          optionValues={dropdownOptions.show_category_difficulty}
          onChange={(e) =>
            setVersionSettingsParam(boolToInt(e.target.checked), "show_category_difficulty")
          }
        />
      ),
    },
    {
      label: "Show Category Alphabet",
      formInput: (
        <Switch
          colorScheme="red"
          isChecked={!!versionSettings?.show_category_alphabet}
          optionValues={dropdownOptions.show_category_alphabet}
          onChange={(e) =>
            setVersionSettingsParam(boolToInt(e.target.checked), "show_category_alphabet")
          }
        />
      ),
    },
    {
      label: "Show Category Rival Play",
      formInput: (
        <Switch
          colorScheme="red"
          isChecked={!!versionSettings?.show_category_rival_play}
          optionValues={dropdownOptions.show_category_rival_play}
          onChange={(e) =>
            setVersionSettingsParam(boolToInt(e.target.checked), "show_category_rival_play")
          }
        />
      ),
    },
    {
      label: "Show Category Rival Win/Lose",
      formInput: (
        <Switch
          colorScheme="red"
          isChecked={!!versionSettings?.show_category_rival_winlose}
          optionValues={dropdownOptions.show_category_rival_winlose}
          onChange={(e) =>
            setVersionSettingsParam(boolToInt(e.target.checked), "show_category_rival_winlose")
          }
        />
      ),
    },
    {
      label: "Show Category All Rival Play",
      formInput: (
        <Switch
          colorScheme="red"
          isChecked={!!versionSettings?.show_category_all_rival_play}
          optionValues={dropdownOptions.show_category_all_rival_play}
          onChange={(e) =>
            setVersionSettingsParam(boolToInt(e.target.checked), "show_category_all_rival_play")
          }
        />
      ),
    },
    {
      label: "Show Category Arena Win/Lose",
      formInput: (
        <Switch
          colorScheme="red"
          isChecked={!!versionSettings?.show_category_arena_winlose}
          optionValues={dropdownOptions.show_category_arena_winlose}
          onChange={(e) =>
            setVersionSettingsParam(boolToInt(e.target.checked), "show_category_arena_winlose")
          }
        />
      ),
    },
    {
      label: "Show Rival Shop Info",
      formInput: (
        <Switch
          colorScheme="red"
          isChecked={!!versionSettings?.show_rival_shop_info}
          optionValues={dropdownOptions.show_rival_shop_info}
          onChange={(e) =>
            setVersionSettingsParam(boolToInt(e.target.checked), "show_rival_shop_info")
          }
        />
      ),
    },
    {
      label: "Hide Play Count",
      formInput: (
        <Switch
          colorScheme="red"
          isChecked={!!versionSettings?.hide_play_count}
          optionValues={dropdownOptions.hide_play_count}
          onChange={(e) =>
            setVersionSettingsParam(boolToInt(e.target.checked), "hide_play_count")
          }
        />
      ),
    },
    {
      label: "Score Graph Cutin",
      formInput: (
        <Switch
          colorScheme="red"
          isChecked={!!versionSettings?.show_score_graph_cutin}
          optionValues={dropdownOptions.show_score_graph_cutin}
          onChange={(e) =>
            setVersionSettingsParam(boolToInt(e.target.checked), "show_score_graph_cutin")
          }
        />
      ),
    },
    {
      label: "Hide IIDX ID",
      formInput: (
        <Switch
          colorScheme="red"
          isChecked={!!versionSettings?.hide_iidx_id}
          optionValues={dropdownOptions.hide_iidx_id}
          onChange={(e) =>
            setVersionSettingsParam(boolToInt(e.target.checked), "hide_iidx_id")
          }
        />
      ),
    },
    {
      label: "Classic Hispeed",
      formInput: (
        <Switch
          colorScheme="red"
          isChecked={!!versionSettings?.classic_hispeed}
          optionValues={dropdownOptions.classic_hispeed}
          onChange={(e) =>
            setVersionSettingsParam(boolToInt(e.target.checked), "classic_hispeed")
          }
        />
      ),
    },
    {
      label: "Beginner Option Swap",
      formInput: (
        <Switch
          colorScheme="red"
          isChecked={!!versionSettings?.beginner_option_swap}
          optionValues={dropdownOptions.beginner_option_swap}
          onChange={(e) =>
            setVersionSettingsParam(boolToInt(e.target.checked), "beginner_option_swap")
          }
        />
      ),
    },
    {
      label: "Show Lamps as No Play in Arena",
      formInput: (
        <Switch
          colorScheme="red"
          isChecked={!!versionSettings?.show_lamps_as_no_play_in_arena}
          optionValues={dropdownOptions.show_lamps_as_no_play_in_arena}
          onChange={(e) =>
            setVersionSettingsParam(boolToInt(e.target.checked), "show_lamps_as_no_play_in_arena")
          }
        />
      ),
    },
    {
      label: "Show Lamps as No Play in Arena",
      formInput: (
        <Switch
          colorScheme="red"
          isChecked={!!versionSettings?.show_lamps_as_no_play_in_arena}
          optionValues={dropdownOptions.show_lamps_as_no_play_in_arena}
          onChange={(e) =>
            setVersionSettingsParam(boolToInt(e.target.checked), "show_lamps_as_no_play_in_arena")
          }
        />
      ),
    },
    {
      label: "Lightning Frame",
      formInput: (
        <SettingsSelect
          value={optionLookupByIndex('skin_customize_flag_frame')}
          optionValues={dropdownOptions.skin_customize_flag_frame}
          onChange={(e) =>
            setVersionSettingsParamByOptionIndex(e, "skin_customize_flag_frame")
          }
        />
      ),
    },
    {
      label: "Lightning BGM",
      formInput: (
        <SettingsSelect
          value={optionLookupByIndex('skin_customize_flag_bgm')}
          optionValues={dropdownOptions.skin_customize_flag_bgm}
          onChange={(e) =>
            setVersionSettingsParamByOptionIndex(e, "skin_customize_flag_bgm")
          }
        />
      ),
    },
    {
      label: "Lightning Lane",
      formInput: (
        <SettingsSelect
          value={optionLookupByIndex('skin_customize_flag_lane')}
          optionValues={dropdownOptions.skin_customize_flag_lane}
          onChange={(e) =>
            setVersionSettingsParamByOptionIndex(e, "skin_customize_flag_lane")
          }
        />
      ),
    },
    {
      label: "SP Rivals",
      formInput: (
        <>
          {rivalKeysSP.map((currentRivalKeySP, i) => (
            <SettingsSelect
              value={versionSettings?.[currentRivalKeySP] || ""}
              optionValues={filterRivalIdsSP({ profileIds, currentRivalKeySP, versionSettings, profiles, selectedVersionKey, selectedProfileId })}
              optionLabels={filterRivalIdsSP({ profileIds, currentRivalKeySP, versionSettings, profiles, selectedVersionKey, selectedProfileId })?.map(
                (id) =>
                  `${addDashToId(id)} - ${getNameFromProfileIdAndVersionKey(
                    profiles,
                    id,
                    selectedVersionKey
                  )}`
              )}
              placeholder="None"
              disabled={i > 0 && !versionSettings?.[`sp_rival_${i}_iidx_id`]}
              onChange={(e) => onChangeRivalsSP(e.target.value, currentRivalKeySP)}
              w={smallInputWidth}
            />
          ))}
        </>
      ),
    },
    {
      label: "DP Rivals",
      formInput: (
        <>
          {rivalKeysDP.map((currentRivalKeyDP, i) => (
            <SettingsSelect
              value={versionSettings?.[currentRivalKeyDP] || ""}
              optionValues={filterRivalIdsDP({ profileIds, currentRivalKeyDP, versionSettings, profiles, selectedVersionKey, selectedProfileId })}
              optionLabels={filterRivalIdsDP({ profileIds, currentRivalKeyDP, versionSettings, profiles, selectedVersionKey, selectedProfileId })?.map(
                (id) =>
                  `${addDashToId(id)} - ${getNameFromProfileIdAndVersionKey(
                    profiles,
                    id,
                    selectedVersionKey
                  )}`
              )}
              placeholder="None"
              disabled={i > 0 && !versionSettings?.[`dp_rival_${i}_iidx_id`]}
              onChange={(e) => onChangeRivalsDP(e.target.value, currentRivalKeyDP)}
              w={smallInputWidth}
            />
          ))}
        </>
      ),
    },
  ]);
}

export {
  dropdownOptions,
  rivalKeysSP,
  rivalKeysDP,
  iidxSettingsFormConfig
}