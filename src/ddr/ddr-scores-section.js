import {
  Heading,
  Text,
  Badge,
  Tooltip,
  Flex,
  Box,
  Grid,
  HStack,
  Checkbox,
  Input,
  Select,
  IconButton,
  keyframes,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  useColorModeValue,
  useBreakpointValue,
} from "@chakra-ui/react";
import { DateTime, Interval } from "luxon";
import { startTransition, useDeferredValue, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";

const SINGLE = "Single",
  DOUBLE = "Double",
  BEGINNER = "Beginner",
  BASIC = "Basic",
  DIFFICULT = "Difficult",
  EXPERT = "Expert",
  CHALLENGE = "Challenge";

const difficultyColors = {
  [BEGINNER]: "46, 219, 255",
  [BASIC]: "255, 174, 0",
  [DIFFICULT]: "255, 56, 79",
  [EXPERT]: "58, 236, 40",
  [CHALLENGE]: "241, 84, 166",
};

const spdpColors = {
  [SINGLE]: "50, 242, 255",
  [DOUBLE]: "255, 175, 0",
};


const MARVELOUS = 'judge_marvelous'
const PERFECT = 'judge_perfect'
const GREAT = 'judge_great'
const GOOD = 'judge_good'
const BOO = 'judge_boo'
const MISS = 'judge_miss'
const OK = 'judge_ok'
const NG = 'judge_ng'
const FASTCOUNT = 'fastcount'
const SLOWCOUNT = 'slowcount'
const MAXCOMBO = 'maxcombo'
const EXSCORE = 'exscore'

const difficultyMap = {
  0: {
    abbr: "BSP",
    type: SINGLE,
    difficulty: BEGINNER,
    rgb: difficultyColors[BEGINNER],
  },
  1: {
    abbr: "BSP",
    type: SINGLE,
    difficulty: BASIC,
    rgb: difficultyColors[BASIC],
  },
  2: {
    abbr: "DSP",
    type: SINGLE,
    difficulty: DIFFICULT,
    rgb: difficultyColors[DIFFICULT],
  },
  3: {
    abbr: "ESP",
    type: SINGLE,
    difficulty: EXPERT,
    rgb: difficultyColors[EXPERT],
  },
  4: {
    abbr: "CSP",
    type: SINGLE,
    difficulty: CHALLENGE,
    rgb: difficultyColors[CHALLENGE],
  },
  5: {
    abbr: "BDP",
    type: DOUBLE,
    difficulty: BASIC,
    rgb: difficultyColors[BASIC],
  },
  6: {
    abbr: "DDP",
    type: DOUBLE,
    difficulty: DIFFICULT,
    rgb: difficultyColors[DIFFICULT],
  },
  7: {
    abbr: "EDP",
    type: DOUBLE,
    difficulty: EXPERT,
    rgb: difficultyColors[EXPERT],
  },
  8: {
    abbr: "CDP",
    type: DOUBLE,
    difficulty: CHALLENGE,
    rgb: difficultyColors[CHALLENGE],
  },
};

const lampMap = {
  1: { abbr: "FAIL", text: "Fail", rgb: "186, 186, 186" },
  2: { abbr: "?", text: "2", rgb: "186, 186, 186" },
  3: { abbr: "CLEAR", text: "Clear", rgb: "186, 186, 186" },
  4: { abbr: "?", text: "4", rgb: "186, 186, 186" },
  5: { abbr: "LIFE8", text: "Life 8 Clear", rgb: "186, 186, 186" },
  6: { abbr: "LIFE4", text: "Life 4 Clear", rgb: "186, 186, 186" },
  7: { abbr: "FC", text: "Good Full Combo", rgb: "0, 192, 255" },
  8: { abbr: "FC", text: "Great Full Combo", rgb: "0, 255, 42" },
  9: { abbr: "PFC", text: "Perfect Full Combo", rgb: "246, 253, 105" },
  10: { abbr: "MFC", text: "Marvelous Full Combo", rgb: "254, 254, 204" },
};

const rankMap = {
  0: { text: "AAA", rgb: "247, 239, 145" },
  1: { text: "AA+", rgb: "255, 230, 14" },
  2: { text: "AA", rgb: "255, 230, 14" },
  3: { text: "AA-", rgb: "255, 230, 14" },
  4: { text: "A+", rgb: "255, 230, 14" },
  5: { text: "A", rgb: "255, 230, 14" },
  6: { text: "A-", rgb: "255, 230, 14" },
  7: { text: "B+", rgb: "41, 137, 255" },
  8: { text: "B", rgb: "41, 137, 255" },
  9: { text: "B-", rgb: "41, 137, 255" },
  10: { text: "C+", rgb: "255, 115, 255" },
  11: { text: "C", rgb: "255, 115, 255" },
  12: { text: "C-", rgb: "255, 115, 255" },
  13: { text: "D+", rgb: "255, 59, 14" },
  14: { text: "D", rgb: "255, 59, 14" },
  15: { text: "E", rgb: "186, 186, 186" },
};

/**
 * DDR DP doesn't have a Beginner chart. Some metadata sources store DP levels shifted by 1.
 * Normalize the lookup so DP Basic/Difficult/Expert/Challenge map to the correct level.
 */
const getChartLevel = (DDR_MDB, mcode, difficulty) => {
  if (!DDR_MDB || !mcode || difficulty == null) return undefined;
  const playType = difficultyMap?.[difficulty]?.type;
  const rawIndex =
    playType === DOUBLE && Number.isFinite(Number(difficulty)) ? Number(difficulty) + 1 : Number(difficulty);
  const index = Number.isFinite(rawIndex) ? rawIndex : difficulty;
  return DDR_MDB?.[mcode]?.diffLv?.[index];
};

const formatDifficulty = (DDR_MDB, mcode, difficulty, invertLabel) => {

  if (!DDR_MDB || !mcode || !difficulty) return <></>

  const difficultyChar = difficultyMap[difficulty].abbr.slice(0, 1);
  const spdpChar = difficultyMap[difficulty].abbr.slice(1);
  const abbrString = `${difficultyChar}${spdpChar}`
  const fullInfoString = `${difficultyMap[difficulty].difficulty} ${difficultyMap[difficulty].type}`;

  if (invertLabel) {
    return (
      <>
        <Tooltip
          hasArrow
          label={abbrString}
          aria-label={abbrString}
          placement="left"

        >
          <Flex display="inline-flex">
            <Text
              display="inline"
              border={`0px solid rgb(${difficultyMap[difficulty].rgb})`}
            >
              {fullInfoString}
            </Text>

          </Flex>
        </Tooltip>
        {` `}
        {getChartLevel(DDR_MDB, mcode, difficulty) || "??"}
      </>
    )
  }
  return (
    <>
      <Tooltip
        hasArrow
        label={fullInfoString}
        aria-label={fullInfoString}
        placement="top-end"
      >
        <Flex display="inline-flex">
          <Text
            display="inline"
            border={`0px solid rgb(${difficultyMap[difficulty].rgb})`}
          >
            {difficultyChar}
          </Text>
          <Text
            display="inline"
            border={`0px solid rgb(${spdpColors[difficultyMap[difficulty].type]
              })`}
          >
            {spdpChar}
          </Text>
        </Flex>
      </Tooltip>
      {` `}
      {getChartLevel(DDR_MDB, mcode, difficulty) || "??"}
    </>
  );
};

const formatTimestamp = (timestamp) => {
  const isoDate = new Date(timestamp * 1000);
  // YYYY-MM-DD: isoDate.toISOString().split("T")[0]
  return `${isoDate.toLocaleDateString()} ${isoDate.toLocaleTimeString()}`;
};

const getTimeSincePlayed = (timestamp) => {
  const timestampDateTime = DateTime.fromSeconds(timestamp);
  const nowDateTime = DateTime.now();

  const interval = Interval.fromDateTimes(
    timestampDateTime,
    nowDateTime
  ).toDuration(["days", "hours", "minutes"]).values;
  // YYYY-MM-DD: isoDate.toISOString().split("T")[0]
  const daysString = interval.days
    ? `${interval.days} ${interval.days > 1 ? "days" : "day"}, `
    : "";
  const hoursString = interval.hours
    ? `${interval.hours} ${interval.hours > 1 ? "hours" : "hour"}, `
    : "";
  const minutesString = interval.minutes
    ? `${parseInt(interval.minutes)}  ${parseInt(interval.minutes) === 1 ? "minute" : "minutes"}`
    : "";

  return `${daysString}${hoursString}${minutesString} ago`;
};

const formatResultsCount = (shown, total) => {
  const s = Number(shown) || 0;
  const t = Number(total) || 0;
  if (s === t) return t.toLocaleString();
  return `${s.toLocaleString()} / ${t.toLocaleString()}`;
};

const DdrScoresSection = ({ selectedDdrProfileId, getScoresQuery, DDR_MDB }) => {
  const rawScores = getScoresQuery?.data?.data;
  const scores = useMemo(() => (Array.isArray(rawScores) ? rawScores : []), [rawScores]);

  const [sort, setSort] = useState({ key: "timestamp", dir: "desc" }); // default: newest first
  const [searchText, setSearchText] = useState("");
  const deferredSearchText = useDeferredValue(searchText);
  const [searchMode, setSearchMode] = useState("title"); // title | artist | title_any | artist_any
  const [chartFilter, setChartFilter] = useState(""); // difficulty name: Beginner/Basic/Difficult/Expert/Challenge
  const [levelFilter, setLevelFilter] = useState(""); // "" (Any) | "1".."19"
  const [filterSingle, setFilterSingle] = useState(true);
  const [filterDouble, setFilterDouble] = useState(true);
  const [rankFilter, setRankFilter] = useState(""); // rankMap key (string) or empty
  const [lampFilter, setLampFilter] = useState(""); // lampMap key (string) or empty

  const collator = useMemo(() => new Intl.Collator(undefined, { numeric: true, sensitivity: "base" }), []);

  const filteredScores = useMemo(() => {
    if (!scores.length) return [];

    const q = deferredSearchText.trim().toLowerCase();

    return scores.filter((row) => {
      if (chartFilter !== "") {
        const difficultyName = difficultyMap?.[row?.difficulty]?.difficulty;
        if (`${difficultyName}` !== `${chartFilter}`) return false;
      }

      if (levelFilter !== "") {
        const levelRaw = getChartLevel(DDR_MDB, row?.mcode, row?.difficulty);
        if (`${Number(levelRaw)}` !== `${levelFilter}`) return false;
      }

      const playType = difficultyMap?.[row?.difficulty]?.type;
      // Style filters (both active = Any; neither active = no results)
      if (!filterSingle && !filterDouble) return false;
      if (filterSingle && !filterDouble && playType !== SINGLE) return false;
      if (!filterSingle && filterDouble && playType !== DOUBLE) return false;
      if (rankFilter !== "" && `${row?.rank}` !== `${rankFilter}`) return false;
      if (lampFilter !== "" && `${row?.lamp}` !== `${lampFilter}`) return false;

      if (!q) return true;

      const mcode = row?.mcode;
      const title = DDR_MDB?.[mcode]?.title;
      const artist = DDR_MDB?.[mcode]?.artist;
      const useArtist = searchMode === "artist" || searchMode === "artist_any";
      const useContains = searchMode === "title_any" || searchMode === "artist_any";
      const hay = useArtist ? `${artist ?? ""}`.toLowerCase() : `${title ?? mcode ?? ""}`.toLowerCase();

      return useContains ? hay.includes(q) : hay.startsWith(q);
    });
  }, [
    scores,
    deferredSearchText,
    chartFilter,
    levelFilter,
    filterSingle,
    filterDouble,
    rankFilter,
    lampFilter,
    DDR_MDB,
    searchMode,
  ]);

  const sortedScores = useMemo(() => {
    if (!filteredScores.length) return [];

    const dirMul = sort.dir === "asc" ? 1 : -1;

    const getSongTitle = (row) => {
      const mcode = row?.mcode;
      const title = DDR_MDB?.[mcode]?.title;
      return `${title ?? mcode ?? ""}`;
    };

    const compare = (a, b) => {
      switch (sort.key) {
        case "song": {
          return collator.compare(getSongTitle(a), getSongTitle(b)) * dirMul;
        }
        case "chart": {
          // Sort by the displayed chart level number (e.g. "CSP 19" -> 19).
          // Prefer DDR_MDB diffLv lookup; fall back to numeric difficulty index if missing.
          const aLevelRaw = getChartLevel(DDR_MDB, a?.mcode, a?.difficulty);
          const bLevelRaw = getChartLevel(DDR_MDB, b?.mcode, b?.difficulty);
          const aLevel = Number(aLevelRaw);
          const bLevel = Number(bLevelRaw);
          if (Number.isFinite(aLevel) || Number.isFinite(bLevel)) {
            return ((Number.isFinite(aLevel) ? aLevel : 0) - (Number.isFinite(bLevel) ? bLevel : 0)) * dirMul;
          }

          const av = Number(a?.difficulty);
          const bv = Number(b?.difficulty);
          return ((Number.isFinite(av) ? av : 0) - (Number.isFinite(bv) ? bv : 0)) * dirMul;
        }
        case "lamp": {
          // Sort by lamp code (higher lamp should come first when desc).
          const av = Number(a?.lamp);
          const bv = Number(b?.lamp);
          return ((Number.isFinite(av) ? av : 0) - (Number.isFinite(bv) ? bv : 0)) * dirMul;
        }
        case "score": {
          const av = Number(a?.score);
          const bv = Number(b?.score);
          return ((Number.isFinite(av) ? av : 0) - (Number.isFinite(bv) ? bv : 0)) * dirMul;
        }
        case "timestamp":
        default: {
          const av = Number(a?.timestamp);
          const bv = Number(b?.timestamp);
          return ((Number.isFinite(av) ? av : 0) - (Number.isFinite(bv) ? bv : 0)) * dirMul;
        }
      }
    };

    // Copy so we don't mutate the React Query cache array.
    return [...filteredScores].sort(compare);
  }, [filteredScores, sort, DDR_MDB, collator]);

  const onToggleSort = (key) => {
    setSort((prev) => {
      if (prev.key !== key) return { key, dir: "asc" };
      return { key, dir: prev.dir === "asc" ? "desc" : "asc" };
    });
  };

  const onClearFilters = () => {
    setSearchText("");
    setSearchMode("title");
    setChartFilter("");
    setLevelFilter("");
    setFilterSingle(true);
    setFilterDouble(true);
    setRankFilter("");
    setLampFilter("");
    setSort({ key: "timestamp", dir: "desc" });
    parentRef.current?.scrollTo?.({ top: 0 });
  };

  const onToggleFilterSingle = () => {
    setFilterSingle((prev) => {
      const next = !prev;
      if (!next && !filterDouble) {
        setFilterDouble(true);
      }
      return next;
    });
  };

  const onToggleFilterDouble = () => {
    setFilterDouble((prev) => {
      const next = !prev;
      if (!next && !filterSingle) {
        setFilterSingle(true);
      }
      return next;
    });
  };

  const clearIsNoop =
    searchText === "" &&
    chartFilter === "" &&
    levelFilter === "" &&
    filterSingle === true &&
    filterDouble === true &&
    rankFilter === "" &&
    lampFilter === "" &&
    sort?.key === "timestamp" &&
    sort?.dir === "desc";

  const clearNoopHoverBg = useColorModeValue("blackAlpha.50", "whiteAlpha.100");
  const clearNoopActiveBg = useColorModeValue("blackAlpha.100", "whiteAlpha.200");
  const clearActionHoverBg = useColorModeValue("blue.50", "whiteAlpha.200");
  const clearActionActiveBg = useColorModeValue("blue.100", "whiteAlpha.300");

  // Reset scroll position when filters/search change.
  // Keeps UX predictable (top of filtered set) and avoids confusion with virtualization.
  useLayoutEffect(() => {
    parentRef.current?.scrollTo?.({ top: 0 });
  }, [deferredSearchText, searchMode, chartFilter, levelFilter, filterSingle, filterDouble, rankFilter, lampFilter]);

  const parentRef = useRef(null);
  const outerRef = useRef(null);
  const headerGridRef = useRef(null);
  /** Must be bounded on first paint — if `auto`, the spacer can grow to full list height and freezes the UI */
  const [availableHeight, setAvailableHeight] = useState(() =>
    typeof window !== "undefined" ? `${Math.max(280, window.innerHeight - 200)}px` : "60vh"
  );
  const [headerScrollbarOffsetPx, setHeaderScrollbarOffsetPx] = useState(0);

  const ROW_HEIGHT_PX = 28;

  const rowVirtualizer = useVirtualizer({
    count: sortedScores.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ROW_HEIGHT_PX,
    overscan: 5,
    getItemKey: (index) =>
      `ddr-score-${sortedScores[index]?.mcode}-${sortedScores[index]?.timestamp}`,
  });

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [selectedRowIndex, setSelectedRowIndex] = useState(null);

  const selectedRow = useMemo(() => {
    if (selectedRowIndex == null) return null;
    return sortedScores?.[selectedRowIndex] ?? null;
  }, [sortedScores, selectedRowIndex]);

  const onOpenModal = (index) => {
    setSelectedRowIndex(index);
    onOpen();
  };

  const onCloseModal = () => {
    setSelectedRowIndex(null);
    onClose();
  };

  // If the filtered/sorted list changes while open, keep selection safe.
  useEffect(() => {
    if (!isOpen) return;
    if (selectedRowIndex == null) return;
    if (selectedRowIndex < 0 || selectedRowIndex >= sortedScores.length) {
      onCloseModal();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, selectedRowIndex, sortedScores.length]);

  const spinKeyframes = keyframes`
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  `;

  const RefreshIcon = ({ ...args }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      {...args}
    >
      <path d="M12 4C14.5905 4 16.8939 5.23053 18.3573 7.14274L16 9.5H22V3.5L19.7814 5.71863C17.9494 3.452 15.1444 2 12 2 6.47715 2 2 6.47715 2 12H4C4 7.58172 7.58172 4 12 4ZM20 12C20 16.4183 16.4183 20 12 20 9.40951 20 7.10605 18.7695 5.64274 16.8573L8 14.5 2 14.5V20.5L4.21863 18.2814C6.05062 20.548 8.85557 22 12 22 17.5228 22 22 17.5228 22 12H20Z" />
    </svg>
  );

  const rowHoverBg = useColorModeValue("gray.100", "gray.700");
  const borderLeftDefault = useColorModeValue("white", "gray.700");
  const cellTextColor = useColorModeValue("gray.900", "gray.100");
  const headerBg = useColorModeValue("gray.50", "gray.800");
  const refreshButtonBg = useColorModeValue("gray.100", "transparent");
  const refreshButtonHoverBg = useColorModeValue("gray.200", "whiteAlpha.200");
  const refreshButtonActiveBg = useColorModeValue("gray.300", "whiteAlpha.300");
  const refreshButtonIconColor = useColorModeValue("gray.700", "gray.100");

  const [refreshSpinTick, setRefreshSpinTick] = useState(0);
  const refreshIsFetching = Boolean(getScoresQuery?.isFetching);

  const onRefresh = () => {
    setRefreshSpinTick((t) => t + 1);
    try {
      getScoresQuery?.refetch?.();
    } catch (e) {
      // no-op
    }
  };

  /** Header + row grid: flexible `fr` tracks fill remaining browser width; tighter mins on small screens */
  const scoreGridColumns = useBreakpointValue(
    {
      base: "minmax(8rem, 1fr) 3.75rem 6.25rem 6.25rem 9.5rem",
      md: "minmax(16rem, 1fr) 4.5rem 8rem 7rem 11.5rem",
    },
    "minmax(16rem, 1fr) 4.5rem 8rem 7rem 11.5rem"
  );

  useLayoutEffect(() => {
    const update = () => {
      const outerEl = outerRef.current;
      if (!outerEl) return;
      const top = outerEl.getBoundingClientRect().top;
      const h = window.innerHeight - top - 8;
      setAvailableHeight(h > 280 ? `${h}px` : `${Math.max(280, window.innerHeight * 0.5)}px`);
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useLayoutEffect(() => {
    const scrollEl = parentRef.current;
    if (!scrollEl) {
      setHeaderScrollbarOffsetPx(0);
      return undefined;
    }

    const updateScrollbarOffset = () => {
      const scrollbarWidth = Math.max(0, scrollEl.offsetWidth - scrollEl.clientWidth);
      setHeaderScrollbarOffsetPx(scrollbarWidth);
    };

    updateScrollbarOffset();

    const resizeObserver =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(updateScrollbarOffset)
        : null;
    resizeObserver?.observe(scrollEl);
    window.addEventListener("resize", updateScrollbarOffset);

    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener("resize", updateScrollbarOffset);
    };
  }, [sortedScores.length, availableHeight]);

  return (
    <>
      <Box w="100%" maxW="60rem" mx="auto">
      <Flex align="center" gap={2} mb="0.5rem">
        <Heading size="md" textAlign="left" lineHeight="1">
          Scores
        </Heading>
        {/* Reserve space so the heading never nudges when button appears/disappears */}
        <IconButton
          aria-label="Refresh scores"
          onClick={onRefresh}
          size="xs"
          variant="ghost"
          bg={refreshButtonBg}
          _hover={{ bg: refreshButtonHoverBg }}
          _active={{ bg: refreshButtonActiveBg }}
          isDisabled={!selectedDdrProfileId || !getScoresQuery?.refetch}
          minW="1.5rem"
          w="1.5rem"
          h="1.5rem"
          p={0}
          visibility={selectedDdrProfileId ? "visible" : "hidden"}
          aria-hidden={!selectedDdrProfileId}
          tabIndex={selectedDdrProfileId ? 0 : -1}
          icon={
            <Box
              color={refreshButtonIconColor}
              display="inline-flex"
              animation={refreshIsFetching ? `${spinKeyframes} 0.3s linear infinite` : undefined}
              key={refreshSpinTick}
              sx={
                refreshIsFetching
                  ? undefined
                  : {
                      "@media (prefers-reduced-motion: no-preference)": {
                        animation: `${spinKeyframes} 0.2s linear`,
                      },
                    }
              }
            >
              <RefreshIcon width="0.8rem" />
            </Box>
          }
        />
        <Text
          fontSize="xs"
          opacity={0.8}
          fontVariantNumeric="tabular-nums"
          minW="6.5rem"
          lineHeight="1"
          visibility={selectedDdrProfileId ? "visible" : "hidden"}
          aria-hidden={!selectedDdrProfileId}
        >
          {formatResultsCount(filteredScores.length, scores.length)}
        </Text>
      </Flex>
      {selectedDdrProfileId ? (
        <HStack spacing={2} mb="0.75rem" align="flex-end" flexWrap="wrap" w="100%">
          <Box>
            <HStack spacing={2} align="center" justify="space-between">
              <Text fontSize="xs">Search</Text>
              <HStack spacing={2}>
                <Select value={searchMode} onChange={(e) => setSearchMode(e.target.value)} size="xs" w="auto" minW="12ch">
                  <option value="title">Title</option>
                  <option value="artist">Artist</option>
                  <option value="title_any">Title Any</option>
                  <option value="artist_any">Artist Any</option>
                </Select>
              </HStack>
            </HStack>
            <Input
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Filter…"
              size="sm"
              w={{ base: "14rem", md: "12rem" }}
            />
          </Box>
          <Box>
            <Text fontSize="xs">Chart</Text>
            <Select value={chartFilter} onChange={(e) => setChartFilter(e.target.value)} size="sm" w="auto" minW="12ch">
              <option value="">Any</option>
              {[CHALLENGE, EXPERT, DIFFICULT, BASIC, BEGINNER].map((difficultyName) => (
                <option key={`chart-filter-${difficultyName}`} value={difficultyName}>
                  {difficultyName}
                </option>
              ))}
            </Select>
          </Box>
          <Box>
            <Text fontSize="xs">Level</Text>
            <Select value={levelFilter} onChange={(e) => setLevelFilter(e.target.value)} size="sm" w="auto" minW="6ch">
              <option value="">Any</option>
              {Array.from({ length: 19 }, (_, i) => 19 - i).map((lv) => (
                <option key={`level-filter-${lv}`} value={`${lv}`}>
                  {lv}
                </option>
              ))}
            </Select>
          </Box>
          <Box>
            <Text fontSize="xs">Rank</Text>
            <Select value={rankFilter} onChange={(e) => setRankFilter(e.target.value)} size="sm" w="auto" minW="8ch">
              <option value="">Any</option>
              {Object.entries(rankMap).map(([k, v]) => (
                <option key={`rank-filter-${k}`} value={k}>
                  {v.text}
                </option>
              ))}
            </Select>
          </Box>
          <Box>
            <Text fontSize="xs">Lamp</Text>
            <Select value={lampFilter} onChange={(e) => setLampFilter(e.target.value)} size="sm" w="auto" minW="8ch">
              <option value="">Any</option>
              {Object.entries(lampMap)
                .sort((a, b) => Number(b[0]) - Number(a[0])) // MFC -> ... -> FAIL
                .filter(([, v]) => v?.abbr !== "?")
                .map(([k, v]) => (
                  <option key={`lamp-filter-${k}`} value={k}>
                    {v.abbr === "FC" ? "GFC" : v.abbr}
                  </option>
                ))}
            </Select>
          </Box>
          <Box>
            <HStack spacing={3} minH="2rem" align="center">
              <Checkbox size="sm" isChecked={filterSingle} onChange={onToggleFilterSingle}>
                SP
              </Checkbox>
              <Checkbox size="sm" isChecked={filterDouble} onChange={onToggleFilterDouble}>
                DP
              </Checkbox>
            </HStack>
          </Box>
          <Tooltip hasArrow label="Reset Filter" aria-label="Reset Filter" placement="top">
            <IconButton
              aria-label="Reset Filter"
              onClick={onClearFilters}
              size="sm"
              variant="ghost"
              color="blue.300"
              _hover={{ bg: clearIsNoop ? clearNoopHoverBg : clearActionHoverBg }}
              _active={{ bg: clearIsNoop ? clearNoopActiveBg : clearActionActiveBg }}
              visibility={clearIsNoop ? "hidden" : "visible"}
              aria-hidden={clearIsNoop}
              tabIndex={clearIsNoop ? -1 : 0}
              icon={<Box as="span" lineHeight="1" fontSize="0.9rem">↺</Box>}
            />
          </Tooltip>
        </HStack>
      ) : null}
      <Box width="100%">
        {!selectedDdrProfileId || getScoresQuery?.isError ? (
          <Text>No Scores</Text>
        ) : getScoresQuery?.isLoading && !rawScores ? (
          <Text>Loading...</Text>
        ) : sortedScores.length === 0 ? (
          <Text>No Scores</Text>
        ) : (
          <Box
            ref={outerRef}
            w="100%"
            display="flex"
            flexDir="column"
            minH={0}
            h={availableHeight}
            overflow="hidden"
          >
            <Grid
              ref={headerGridRef}
              templateColumns={scoreGridColumns}
              gap={0}
              w="100%"
              minW={0}
              pl={3}
              pr={`calc(0.75rem + ${headerScrollbarOffsetPx}px)`}
              py={2}
              borderLeft={`4px solid ${borderLeftDefault}`}
              borderBottom="1px solid"
              borderBottomColor="border.subtle"
              fontWeight="semibold"
              fontSize="xs"
              textTransform="none"
              bg={headerBg}
              color="fg.default"
              flexShrink={0}
            >
              <Box
                cursor="pointer"
                userSelect="none"
                onClick={() => onToggleSort("song")}
                _hover={{ textDecoration: "underline" }}
              >
                <Box as="span">Song</Box>{" "}
                <Box as="span" display="inline-block" w="1ch" textAlign="center">
                  <Box as="span" visibility={sort.key === "song" ? "visible" : "hidden"}>
                    {sort.dir === "asc" ? "▲" : "▼"}
                  </Box>
                </Box>
              </Box>
              <Box
                cursor="pointer"
                userSelect="none"
                onClick={() => onToggleSort("chart")}
                _hover={{ textDecoration: "underline" }}
                w="100%"
                display="flex"
                justifyContent="center"
              >
                <Box as="span">Chart</Box>{" "}
                <Box as="span" display="inline-block" w="1ch" textAlign="center">
                  <Box as="span" visibility={sort.key === "chart" ? "visible" : "hidden"}>
                    {sort.dir === "asc" ? "▲" : "▼"}
                  </Box>
                </Box>
              </Box>
              <Box
                w="100%"
                display="flex"
                justifyContent="center"
                textAlign="center"
                cursor="pointer"
                userSelect="none"
                onClick={() => onToggleSort("lamp")}
                _hover={{ textDecoration: "underline" }}
              >
                <Box as="span">Rank / Lamp</Box>{" "}
                <Box as="span" display="inline-block" w="1ch" textAlign="center">
                  <Box as="span" visibility={sort.key === "lamp" ? "visible" : "hidden"}>
                    {sort.dir === "asc" ? "▲" : "▼"}
                  </Box>
                </Box>
              </Box>
              <Box
                w="100%"
                textAlign="center"
                cursor="pointer"
                userSelect="none"
                onClick={() => onToggleSort("score")}
                _hover={{ textDecoration: "underline" }}
                display="flex"
                justifyContent="center"
                pr={1}
              >
                <Box as="span">Score</Box>{" "}
                <Box as="span" display="inline-block" w="1ch" textAlign="center">
                  <Box as="span" visibility={sort.key === "score" ? "visible" : "hidden"}>
                    {sort.dir === "asc" ? "▲" : "▼"}
                  </Box>
                </Box>
              </Box>
              <Box
                w="100%"
                textAlign="right"
                cursor="pointer"
                userSelect="none"
                onClick={() => onToggleSort("timestamp")}
                _hover={{ textDecoration: "underline" }}
                display="flex"
                justifyContent="flex-end"
                pl={1}
              >
                <Box as="span">Timestamp</Box>{" "}
                <Box as="span" display="inline-block" w="1ch" textAlign="center">
                  <Box as="span" visibility={sort.key === "timestamp" ? "visible" : "hidden"}>
                    {sort.dir === "asc" ? "▲" : "▼"}
                  </Box>
                </Box>
              </Box>
            </Grid>
            <Box
              ref={parentRef}
              flex="1"
              minH={0}
              overflowY="auto"
              overflowX="hidden"
              sx={{ scrollbarGutter: "stable" }}
              w="100%"
              position="relative"
              role="region"
              aria-label="DDR scores list (scroll for more)"
            >
              <Box
                h={`${rowVirtualizer.getTotalSize()}px`}
                w="100%"
                position="relative"
              >
                {rowVirtualizer.getVirtualItems().map((vi) => {
                  const row = sortedScores[vi.index];
                  const {
                    mcode,
                    difficulty,
                    score,
                    exscore,
                    lamp,
                    timestamp,
                    rank,
                  } = row;
                  return (
                    <Box
                      key={vi.key}
                      data-index={vi.index}
                      position="absolute"
                      top={0}
                      left={0}
                      w="100%"
                      h={`${ROW_HEIGHT_PX}px`}
                      overflow="hidden"
                      transform={`translateY(${vi.start}px)`}
                    >
                      <Grid
                        templateColumns={scoreGridColumns}
                        gap={0}
                        alignItems="center"
                        w="100%"
                        minW={0}
                        px={3}
                        py={0}
                        h={`${ROW_HEIGHT_PX}px`}
                        borderLeft={`4px solid ${borderLeftDefault}`}
                        borderBottom="1px solid"
                        borderBottomColor="border.subtle"
                        cursor="pointer"
                        _hover={{
                          borderLeft: `4px solid rgb(${lampMap?.[lamp]?.rgb})`,
                          bg: rowHoverBg,
                        }}
                        onClick={() => onOpenModal(vi.index)}
                      >
                        <Box minW={0} pr={1}>
                          <Text
                            color={cellTextColor}
                            background="none"
                            fontWeight="400"
                            whiteSpace="nowrap"
                            overflow="hidden"
                            textOverflow="ellipsis"
                          >
                            {DDR_MDB?.[mcode]?.title || mcode}
                          </Text>
                        </Box>
                        <Box w="100%" display="flex" justifyContent="center">
                          <Badge
                            color={cellTextColor}
                            background="none"
                            fontWeight="400"
                            textAlign="center"
                            whiteSpace="nowrap"
                          >
                            {formatDifficulty(DDR_MDB, mcode, difficulty)}
                          </Badge>
                        </Box>
                        <HStack
                          justify="center"
                          spacing={1}
                          flexWrap={{ base: "wrap", md: "nowrap" }}
                          w="100%"
                          textAlign="center"
                        >
                          <Badge
                            color={cellTextColor}
                            background="none"
                            border={`0px solid rgb(${rankMap[rank].rgb})`}
                            minW="2.25rem"
                            textAlign="center"
                            fontWeight="400"
                          >
                            {rankMap[rank].text}
                          </Badge>
                          <Tooltip
                            hasArrow
                            label={
                              ![
                                lampMap["3"].text,
                                lampMap["1"].text,
                              ].includes(lampMap?.[lamp]?.text) &&
                              lampMap?.[lamp]?.text
                            }
                            aria-label={
                              ![
                                lampMap["3"].text,
                                lampMap["1"].text,
                              ].includes(lampMap?.[lamp]?.text) &&
                              lampMap?.[lamp]?.text
                            }
                            placement="top-end"
                          >
                            <Badge
                              color={cellTextColor}
                              background="none"
                              minW="4rem"
                              textAlign="center"
                              fontWeight="400"
                              border={`0px solid rgb(${lampMap?.[lamp]?.rgb})`}
                            >
                              {lampMap?.[lamp]?.abbr}
                            </Badge>
                          </Tooltip>
                        </HStack>
                        <Box textAlign="center" w="100%" display="flex" justifyContent="center" pr={1}>
                          <Tooltip
                            hasArrow
                            label={`${exscore} EX`}
                            aria-label={`${exscore} EX`}
                            placement="top-end"
                          >
                            <Badge
                              color={cellTextColor}
                              background="none"
                              fontWeight="400"
                            >
                              {score.toLocaleString("en-US")}
                            </Badge>
                          </Tooltip>
                        </Box>
                        <Box textAlign="right" w="100%" display="flex" justifyContent="flex-end" pl={1}>
                          <Tooltip
                            hasArrow
                            label={getTimeSincePlayed(timestamp)}
                            aria-label={getTimeSincePlayed(timestamp)}
                            placement="top-end"
                          >
                            <Badge
                              color={cellTextColor}
                              background="none"
                              fontWeight="400"
                            >
                              {formatTimestamp(timestamp)}
                            </Badge>
                          </Tooltip>
                        </Box>
                      </Grid>
                    </Box>
                  );
                })}
              </Box>
            </Box>
          </Box>
        )}
      </Box>
      </Box>
      <TopScoresModal
        DDR_MDB={DDR_MDB}
        isOpen={isOpen}
        onClose={onCloseModal}
        rowData={selectedRow}
        index={selectedRowIndex}
        count={sortedScores.length}
        onSelectIndex={(nextIndex) => startTransition(() => setSelectedRowIndex(nextIndex))}
      />
    </>
  )
};

const noteGradeColorMap = {
  0: { key: MARVELOUS, color: '#ddf', label: 'Marvelous' },
  1: { key: PERFECT, color: '#ff2', label: 'Perfect' },
  2: { key: GREAT, color: '#2f2', label: 'Great' },
  3: { key: GOOD, color: '#5ff', label: 'Good' },
  4: { key: BOO, color: '#f44', label: 'Boo' },
  5: { key: MISS, color: '#f00', label: 'Miss' },
  6: { key: OK, color: '#ddf', label: 'OK' },
  7: { key: NG, color: '#f00', label: 'N.G.' },
  a: { key: FASTCOUNT, label: 'Fast' },
  b: { key: SLOWCOUNT, label: 'Slow' },
  c: { key: MAXCOMBO, label: 'Max Combo' },
}

const DetailsRow = ({ label, value, leftColumn, rightColumn, isDark, labelStyle, ...props }) => {
  const evenBg = useColorModeValue("#fff", "gray.800");
  const oddBg = useColorModeValue("#000", "gray.700");
  const evenFg = useColorModeValue("#000", "gray.100");
  const oddFg = useColorModeValue("#fff", "gray.100");
  const bg = isDark ? oddBg : evenBg;
  const color = isDark ? oddFg : evenFg;

  const renderSide = (side, align) => {
    if (side == null) return null;
    if (typeof side !== "string") return side;

    // Align strings like "OK: 12" / "NG: 3" so digit width doesn't shift the row.
    const m = side.match(/^(.+?:)\s*(\d+)\s*$/);
    if (!m) {
      return (
        <Text whiteSpace="nowrap" fontVariantNumeric="tabular-nums">
          {side}
        </Text>
      );
    }

    const [, prefix, num] = m;

    if (align === "left") {
      // Keep left side compact: exactly one space between label and number.
      return (
        <Text whiteSpace="nowrap" fontVariantNumeric="tabular-nums">
          {prefix} {num}
        </Text>
      );
    }

    return (
      <Flex
        w="100%"
        justify="flex-end"
        whiteSpace="nowrap"
        fontVariantNumeric="tabular-nums"
        textAlign={align}
      >
        <Flex minW="6.5rem" justify="flex-end" gap={1}>
          <Text>{prefix}</Text>
          <Text minW="3ch" textAlign="right">
            {num}
          </Text>
        </Flex>
      </Flex>
    );
  };

  return (
    <Flex background={bg} color={color} {...props}>
      <Flex flex={4} justify="flex-start">
        {renderSide(leftColumn, "left")}
      </Flex>
      <Flex flex={2} justify="flex-end" whiteSpace="nowrap" {...labelStyle}>
        {label}
      </Flex>
      <Flex flex={2} justify="flex-end">
        {value}
      </Flex>
      <Flex flex={4} justify="flex-end">
        {renderSide(rightColumn, "right")}
      </Flex>
    </Flex>
  );
};

const TopScoresModal = ({ DDR_MDB, isOpen, onClose, rowData, index, count, onSelectIndex }) => {
  const dividerGradient = useColorModeValue(
    "linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(0,0,0,1) 50%, rgba(255,255,255,1) 100%)",
    "linear-gradient(90deg, rgba(45,55,72,1) 0%, rgba(226,232,240,1) 50%, rgba(45,55,72,1) 100%)"
  );
  const modalBg = useColorModeValue("white", "gray.800");
  const modalFg = useColorModeValue("gray.900", "gray.100");

  const canPrev = typeof index === "number" && index > 0;
  const canNext = typeof index === "number" && typeof count === "number" && index < count - 1;

  const onPrev = () => {
    if (!canPrev) return;
    onSelectIndex(index - 1);
  };
  const onNext = () => {
    if (!canNext) return;
    onSelectIndex(index + 1);
  };

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        onPrev();
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        onNext();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, canPrev, canNext, index, count]);

  const ghostLength = rowData?.ghostsize;
  const ghostNotes = rowData?.ghost?.substring(0, ghostLength)?.split("");

  const mdbData = DDR_MDB?.[rowData?.mcode];
  const title = mdbData?.title || rowData?.mcode || "—";
  const artist = mdbData?.artist || "??";

  const NavIcon = ({ dir, ...args }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...args}>
      {dir === "left" ? (
        <path d="M15.5 19 8.5 12l7-7 1.5 1.5L11.5 12l5.5 5.5L15.5 19z" />
      ) : (
        <path d="M8.5 19 7 17.5 12.5 12 7 6.5 8.5 5l7 7-7 7z" />
      )}
    </svg>
  );

  return (
  <Modal isOpen={isOpen} onClose={onClose} isCentered preserveScrollBarGap>
    <ModalOverlay />
    <ModalContent width="30rem" pt="1rem" pb="1rem" bg={modalBg} color={modalFg} position="relative">
      <HStack position="absolute" top="0.5rem" left="0.5rem" spacing={1}>
        <IconButton
          aria-label="Previous score"
          size="sm"
          variant="ghost"
          minW="2rem"
          w="2rem"
          h="2rem"
          isDisabled={!canPrev}
          onClick={onPrev}
          icon={<NavIcon dir="left" width="1.1rem" />}
        />
        <IconButton
          aria-label="Next score"
          size="sm"
          variant="ghost"
          minW="2rem"
          w="2rem"
          h="2rem"
          isDisabled={!canNext}
          onClick={onNext}
          icon={<NavIcon dir="right" width="1.1rem" />}
        />
      </HStack>
      <ModalCloseButton />
      <ModalBody>
        <Flex display='flex' direction='column' align='center'>
          {!rowData ? (
            <Box py={10} textAlign="center" fontSize="sm" opacity={0.8}>
              Loading…
            </Box>
          ) : null}
          {/* {Object.values(rowFieldColorMap).map(({ key, label }) => <Flex><Text width='6rem' textAlign='right' mr='0.5rem'>{label}:</Text> <Text width='6rem'>{rowData?.[key]}</Text> </Flex>)} */}
          <Flex direction='column' align='center' mb='0.5rem' mt="1rem">
            <Text fontSize='0.875rem' fontWeight={'bold'}>{title}</Text>
            <Text fontSize='0.75rem' fontWeight={'bold'}>{artist}</Text>
          </Flex>

          <Box height="1px" width="75%" background={dividerGradient} />
          <Flex fontSize='0.75rem' direction='column' align='center' mb='1rem' mt="1rem" fontWeight='bold'>
            <Text>{formatDifficulty(DDR_MDB, rowData?.mcode, rowData?.difficulty, true)}</Text>
            <Text></Text>
            <Text>{`${rankMap?.[rowData?.rank]?.text ?? "?"} ${lampMap?.[rowData?.lamp]?.abbr ?? "?"}`}</Text>
            <Text>{typeof rowData?.score === "number" ? rowData.score.toLocaleString() : ""}</Text>
          </Flex>

          <Flex direction='column' width="100%">
            <DetailsRow label={'MAX COMBO'} isDark={true} value={rowData?.[MAXCOMBO]} />
            <DetailsRow label={'MARVELOUS'} value={rowData?.[MARVELOUS]} />
            <DetailsRow label={'PERFECT'} value={rowData?.[PERFECT]} />
            <DetailsRow label={'GREAT'} value={rowData?.[GREAT]} />
            <DetailsRow label={'GOOD'} value={rowData?.[GOOD]} leftColumn={`FAST: ${rowData?.[FASTCOUNT]}`} rightColumn={`OK: ${rowData?.[OK]}`} />
            <DetailsRow label={'MISS'} value={rowData?.[MISS]} leftColumn={`SLOW: ${rowData?.[SLOWCOUNT]}`} rightColumn={`NG: ${rowData?.[NG]}`} />
            <DetailsRow label={'EX SCORE'} labelStyle={{ color: '#ff0' }} isDark={true} value={rowData?.[EXSCORE]} />
          </Flex>



          {ghostNotes ? <NoteVisualization notes={ghostNotes} /> : null}

        </Flex>
      </ModalBody>
    </ModalContent>
  </Modal>
  );
};


const CustomTooltip = ({ children, label, ...rest }) => {
  const [show, setShow] = useState(false);
  const tooltipBorder = useColorModeValue("gray.900", "gray.500");
  const tooltipFallbackBg = useColorModeValue("gray.600", "gray.700");
  return (
    <Box
      position="relative"
      display="inline-block"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      <Box
        visibility={show ? "visible" : "hidden"}
        color="white"
        textTransform="none"
        p="0px"
        position="absolute"
        zIndex="1"
        top="100%"
        left="50%"
        marginLeft="-60px"
        w="115px"
        textAlign="center"
        opacity={show ? "1" : "0"}
        transition="none"
        bg={tooltipFallbackBg}
        borderWidth="1px"
        borderStyle="solid"
        borderColor={tooltipBorder}
        {...rest}
      >
        {label}
      </Box>
    </Box>
  );
};

const NoteVisualization = ({ notes = [] }) => {
  const defaultNoteFg = "#000";
  return (
    <Flex width='25rem' height='2rem' mt='1rem' >
      {
        notes.map((note, index) => {
          const noteData = noteGradeColorMap?.[note]
          return (
            <CustomTooltip label={`${index}: ${noteData?.label}`} placement="top"
              bg={noteData?.color}
              color={noteData?.color === '#f00' ? '#fff' : defaultNoteFg}>
              <Box width={`calc(25rem / ${notes.length})`} height='2rem' backgroundColor={noteData?.color} />
            </CustomTooltip>
          )
        })
      }
    </Flex >
  )

}

export default DdrScoresSection;
