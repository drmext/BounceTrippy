const parseCommon = (common) => {
  if (!common) return;
  return {
    name: common.split(",")[27],
  };
};

const patchCommonWithName = (common, name) => {
  const newCommon = common.split(",");
  newCommon[27] = name.toUpperCase();
  return newCommon.join(",");
};

const buildOptions = (values, labels) => {
  return !values
    ? null
    : values?.map((value, i) => (
      <option
        style={{ width: "20rem" }}
        label={labels?.[i] || value?.label || value}
        value={value.value || value}
      >
        {value.value || value}
      </option>
    ));
};

const addDashToId = (id) => {
  const idString = `${id}`;
  return `${idString?.slice(0, 4)}-${idString?.slice(4, 8)}`;
};

const fromOnOff = (value) => value === "On";
const toOnOff = (value) => (value ? "On" : "Off");

const prepareVersionSettings = (ddrVersionSettings) => {
  const { name, common } = ddrVersionSettings
  if (name) {
    ddrVersionSettings.common = patchCommonWithName(
      common,
      name
    );
  }
  return ddrVersionSettings;
};

export {
  parseCommon,
  patchCommonWithName,
  buildOptions,
  addDashToId,
  fromOnOff,
  toOnOff,
  prepareVersionSettings
}