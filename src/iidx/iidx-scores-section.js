
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
  useColorModeValue,
  useBreakpointValue,
} from "@chakra-ui/react";
import { DateTime, Interval } from "luxon";
import { useDeferredValue, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";

const SINGLE = "Single",
  DOUBLE = "Double",
  BEGINNER = "Beginner",
  NORMAL = "Normal",
  HYPER = "Hyper",
  ANOTHER = "Another",
  LEGGENDARIA = "Leggendaria";

const difficultyColors = {
  [BEGINNER]: "46, 219, 255",
  [NORMAL]: "255, 174, 0",
  [HYPER]: "255, 56, 79",
  [ANOTHER]: "58, 236, 40",
  [LEGGENDARIA]: "241, 84, 166",
};

const difficultyMap = {
  0: {
    abbr: "SPB_level",
    type: SINGLE,
    difficulty: BEGINNER,
    rgb: difficultyColors[BEGINNER],
  },
  1: {
    abbr: "SPN_level",
    type: SINGLE,
    difficulty: NORMAL,
    rgb: difficultyColors[NORMAL],
  },
  2: {
    abbr: "SPH_level",
    type: SINGLE,
    difficulty: HYPER,
    rgb: difficultyColors[HYPER],
  },
  3: {
    abbr: "SPA_level",
    type: SINGLE,
    difficulty: ANOTHER,
    rgb: difficultyColors[ANOTHER],
  },
  4: {
    abbr: "SPL_level",
    type: SINGLE,
    difficulty: LEGGENDARIA,
    rgb: difficultyColors[LEGGENDARIA],
  },
  5: {
    abbr: "DPB_level",
    type: DOUBLE,
    difficulty: BEGINNER,
    rgb: difficultyColors[BEGINNER],
  },
  6: {
    abbr: "DPN_level",
    type: DOUBLE,
    difficulty: NORMAL,
    rgb: difficultyColors[NORMAL],
  },
  7: {
    abbr: "DPH_level",
    type: DOUBLE,
    difficulty: HYPER,
    rgb: difficultyColors[HYPER],
  },
  8: {
    abbr: "DPA_level",
    type: DOUBLE,
    difficulty: ANOTHER,
    rgb: difficultyColors[ANOTHER],
  },
  9: {
    abbr: "DPL_level",
    type: DOUBLE,
    difficulty: LEGGENDARIA,
    rgb: difficultyColors[LEGGENDARIA],
  },
};

const lampMap = {
  0: { abbr: "NP", text: "No Play", rgb: "186, 186, 186" },
  1: { abbr: "FAIL", text: "Fail", rgb: "186, 186, 186" },
  2: { abbr: "AC", text: "Assist Clear", rgb: "186, 186, 186" },
  3: { abbr: "EC", text: "Easy Clear", rgb: "186, 186, 186" },
  4: { abbr: "CLEAR", text: "Clear", rgb: "186, 186, 186" },
  5: { abbr: "HC", text: "Hard Clear", rgb: "186, 186, 186" },
  6: { abbr: "EXHC", text: "EX Hard Clear", rgb: "186, 186, 186" },
  7: { abbr: "FC", text: "Full Combo", rgb: "0, 192, 255" },
};

const formatTimestamp = (timestamp) => {
  const isoDate = new Date(timestamp * 1000);
  return `${isoDate.toLocaleDateString()} ${isoDate.toLocaleTimeString()}`;
};

const getTimeSincePlayed = (timestamp) => {
  const timestampDateTime = DateTime.fromSeconds(timestamp);
  const nowDateTime = DateTime.now();

  const interval = Interval.fromDateTimes(
    timestampDateTime,
    nowDateTime
  ).toDuration(["days", "hours", "minutes"]).values;
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

const getGradeFromScore = (notecounts, music_id, chartType, score) => {
  const grades = [
    "F",
    "F",
    "E",
    "D",
    "C",
    "B",
    "A",
    "AA",
    "AAA",
    "MAX",
  ];

  const topscore = notecounts?.[music_id.toString().padStart(5, "0")]?.[chartType] * 2;
  const percent = score / topscore;
  const grade = parseInt(9.0 * percent);
  return grades[grade];
};

/** Axios response body: array or `{ data: array }` */
function getScoresArrayFromQueryData(queryData) {
  const body = queryData?.data;
  if (!body) return [];
  if (Array.isArray(body)) return body;
  if (Array.isArray(body.data)) return body.data;
  return [];
}

const ROW_HEIGHT_PX = 28;

const IidxScoresSection = ({ selectedProfileId, getScoresQuery, DDR_MDB, notecounts }) => {
  const rowHoverBg = useColorModeValue("gray.100", "gray.700");
  const cellTextColor = useColorModeValue("gray.900", "gray.100");
  const headerBg = useColorModeValue("gray.50", "gray.800");
  const borderLeftDefault = useColorModeValue("white", "gray.700");
  const refreshButtonBg = useColorModeValue("gray.100", "transparent");
  const refreshButtonHoverBg = useColorModeValue("gray.200", "whiteAlpha.200");
  const refreshButtonActiveBg = useColorModeValue("gray.300", "whiteAlpha.300");
  const refreshButtonIconColor = useColorModeValue("gray.700", "gray.100");

  const scores = useMemo(() => getScoresArrayFromQueryData(getScoresQuery?.data), [getScoresQuery?.data]);

  const [sort, setSort] = useState({ key: "timestamp", dir: "desc" }); // default: newest first
  const [searchText, setSearchText] = useState("");
  const deferredSearchText = useDeferredValue(searchText);
  const [searchMode, setSearchMode] = useState("title"); // title | artist | title_any | artist_any
  const [chartFilter, setChartFilter] = useState(""); // Beginner/Normal/Hyper/Another/Leggendaria
  const [levelFilter, setLevelFilter] = useState(""); // "" | "1".."12"
  const [rankFilter, setRankFilter] = useState(""); // grade string or ""
  const [lampFilter, setLampFilter] = useState(""); // lampMap key or ""
  const [filterSingle, setFilterSingle] = useState(true);
  const [filterDouble, setFilterDouble] = useState(true);

  const clearIsNoop =
    searchText === "" &&
    chartFilter === "" &&
    levelFilter === "" &&
    rankFilter === "" &&
    lampFilter === "" &&
    filterSingle === true &&
    filterDouble === true &&
    sort?.key === "timestamp" &&
    sort?.dir === "desc";

  const clearNoopHoverBg = useColorModeValue("blackAlpha.50", "whiteAlpha.100");
  const clearNoopActiveBg = useColorModeValue("blackAlpha.100", "whiteAlpha.200");
  const clearActionHoverBg = useColorModeValue("blue.50", "whiteAlpha.200");
  const clearActionActiveBg = useColorModeValue("blue.100", "whiteAlpha.300");

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

  const onClearFilters = () => {
    setSearchText("");
    setSearchMode("title");
    setChartFilter("");
    setLevelFilter("");
    setRankFilter("");
    setLampFilter("");
    setFilterSingle(true);
    setFilterDouble(true);
    setSort({ key: "timestamp", dir: "desc" });
    scrollRef.current?.scrollTo?.({ top: 0 });
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

  const onToggleSort = (key) => {
    setSort((prev) => {
      if (prev.key !== key) return { key, dir: "asc" };
      return { key, dir: prev.dir === "asc" ? "desc" : "asc" };
    });
  };

  const filteredScores = useMemo(() => {
    if (!scores.length) return [];
    const q = deferredSearchText.trim().toLowerCase();
    return scores.filter((row) => {
      const music_id = row?.music_id;
      const play_style = row?.play_style;
      const chart_id = row?.chart_id;
      const ex_score = row?.ex_score;
      const clear_flg = row?.clear_flg;

      if (!filterSingle && !filterDouble) return false;
      if (filterSingle && !filterDouble && play_style !== 0) return false;
      if (!filterSingle && filterDouble && play_style === 0) return false;

      const difficultyIndex = play_style === 0 ? chart_id : chart_id + 5;
      const diff = difficultyMap?.[difficultyIndex]?.difficulty;
      if (chartFilter !== "" && `${diff}` !== `${chartFilter}`) return false;

      if (levelFilter !== "") {
        const abbr = difficultyMap?.[difficultyIndex]?.abbr;
        const levelRaw = DDR_MDB?.[music_id]?.[abbr];
        const lv = Number(levelRaw);
        if (!Number.isFinite(lv) || `${lv}` !== `${levelFilter}`) return false;
      }

      if (lampFilter !== "" && `${clear_flg}` !== `${lampFilter}`) return false;

      if (rankFilter !== "") {
        const chartType = difficultyMap?.[difficultyIndex]?.abbr?.slice(0, 3);
        const grade = getGradeFromScore(notecounts, music_id, chartType, ex_score);
        if (`${grade}` !== `${rankFilter}`) return false;
      }

      if (!q) return true;
      const title = DDR_MDB?.[music_id]?.title;
      const artist = DDR_MDB?.[music_id]?.artist;
      const useArtist = searchMode === "artist" || searchMode === "artist_any";
      const useContains = searchMode === "title_any" || searchMode === "artist_any";
      const hay = useArtist ? `${artist ?? ""}`.toLowerCase() : `${title ?? music_id ?? ""}`.toLowerCase();
      return useContains ? hay.includes(q) : hay.startsWith(q);
    });
  }, [
    scores,
    deferredSearchText,
    chartFilter,
    levelFilter,
    rankFilter,
    lampFilter,
    filterSingle,
    filterDouble,
    DDR_MDB,
    notecounts,
    searchMode,
  ]);

  const collator = useMemo(() => new Intl.Collator(undefined, { numeric: true, sensitivity: "base" }), []);

  const sortedScores = useMemo(() => {
    if (!filteredScores.length) return [];
    const dirMul = sort.dir === "asc" ? 1 : -1;

    const getTitle = (row) => {
      const id = row?.music_id;
      const title = DDR_MDB?.[id]?.title;
      return `${title ?? id ?? ""}`;
    };

    const getDifficultyIndex = (row) => (row?.play_style === 0 ? row?.chart_id : Number(row?.chart_id) + 5);

    const getLevel = (row) => {
      const id = row?.music_id;
      const di = getDifficultyIndex(row);
      const abbr = difficultyMap?.[di]?.abbr;
      const lv = Number(DDR_MDB?.[id]?.[abbr]);
      return Number.isFinite(lv) ? lv : -1;
    };

    const getLamp = (row) => {
      const v = Number(row?.clear_flg);
      return Number.isFinite(v) ? v : -1;
    };

    const getGrade = (row) => {
      const di = getDifficultyIndex(row);
      const chartType = difficultyMap?.[di]?.abbr?.slice(0, 3);
      const grade = getGradeFromScore(notecounts, row?.music_id, chartType, row?.ex_score);
      // Higher is better (MAX highest). Map to index.
      const order = { F: 0, E: 1, D: 2, C: 3, B: 4, A: 5, AA: 6, AAA: 7, MAX: 8 };
      return order?.[grade] ?? -1;
    };

    const compare = (a, b) => {
      switch (sort.key) {
        case "song": {
          return collator.compare(getTitle(a), getTitle(b)) * dirMul;
        }
        case "chart": {
          // Sort by displayed level, then by difficulty index.
          const av = getLevel(a);
          const bv = getLevel(b);
          if (av !== bv) return (av - bv) * dirMul;
          const adi = getDifficultyIndex(a);
          const bdi = getDifficultyIndex(b);
          return ((Number(adi) || 0) - (Number(bdi) || 0)) * dirMul;
        }
        case "lamp": {
          // Sort by lamp (clear_flg) then by grade.
          const av = getLamp(a);
          const bv = getLamp(b);
          if (av !== bv) return (av - bv) * dirMul;
          return (getGrade(a) - getGrade(b)) * dirMul;
        }
        case "score": {
          const av = Number(a?.ex_score);
          const bv = Number(b?.ex_score);
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

    return [...filteredScores].sort(compare);
  }, [filteredScores, sort, DDR_MDB, notecounts, collator]);

  const parentRef = useRef(null);
  const scrollRef = useRef(null);
  const outerRef = useRef(null);
  const headerGridRef = useRef(null);
  const [availableHeight, setAvailableHeight] = useState(() =>
    typeof window !== "undefined" ? `${Math.max(280, window.innerHeight - 220)}px` : "60vh"
  );
  const [headerScrollbarOffsetPx, setHeaderScrollbarOffsetPx] = useState(0);

  useLayoutEffect(() => {
    const el = outerRef.current;
    if (!el) return;
    const update = () => {
      const top = el.getBoundingClientRect().top;
      const h = window.innerHeight - top - 8;
      setAvailableHeight(h > 280 ? `${h}px` : `${Math.max(280, window.innerHeight * 0.5)}px`);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const rowVirtualizer = useVirtualizer({
    count: sortedScores.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => ROW_HEIGHT_PX,
    overscan: 8,
    getItemKey: (index) => {
      const r = sortedScores[index];
      return `iidx-score-${r?.music_id}-${r?.timestamp}-${index}`;
    },
  });

  const rawFromServer = getScoresArrayFromQueryData(getScoresQuery?.data);
  const showLoading = Boolean(getScoresQuery?.isLoading && rawFromServer.length === 0);

  // Reset scroll position when filters/search change.
  useLayoutEffect(() => {
    scrollRef.current?.scrollTo?.({ top: 0 });
  }, [deferredSearchText, searchMode, chartFilter, levelFilter, rankFilter, lampFilter, filterSingle, filterDouble, sort]);

  // Account for body scrollbar width so header columns align.
  useLayoutEffect(() => {
    const scrollEl = scrollRef.current;
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

  const scoreGridColumns = useBreakpointValue(
    {
      base: "minmax(10rem, 1fr) 5rem 7rem 6rem 9.25rem",
      md: "minmax(16rem, 1fr) 6rem 9rem 6.75rem 10.75rem",
    },
    "minmax(16rem, 1fr) 6rem 9rem 6.75rem 10.75rem"
  );

  const gradeOptions = useMemo(() => ["MAX", "AAA", "AA", "A", "B", "C", "D", "E", "F"], []);

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
          isDisabled={!selectedProfileId || !getScoresQuery?.refetch}
          minW="1.5rem"
          w="1.5rem"
          h="1.5rem"
          p={0}
          visibility={selectedProfileId ? "visible" : "hidden"}
          aria-hidden={!selectedProfileId}
          tabIndex={selectedProfileId ? 0 : -1}
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
          visibility={selectedProfileId ? "visible" : "hidden"}
          aria-hidden={!selectedProfileId}
        >
          {formatResultsCount(sortedScores.length, scores.length)}
        </Text>
      </Flex>
      <Box ref={outerRef}>
        {!selectedProfileId || getScoresQuery?.isError ? (
          <Text>No Scores</Text>
        ) : (
          <>
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
              <Select value={chartFilter} onChange={(e) => setChartFilter(e.target.value)} size="sm" w="auto" minW="14ch">
                <option value="">Any</option>
                {[LEGGENDARIA, ANOTHER, HYPER, NORMAL, BEGINNER].map((d) => (
                  <option key={`iidx-chart-filter-${d}`} value={d}>
                    {d}
                  </option>
                ))}
              </Select>
            </Box>
            <Box>
              <Text fontSize="xs">Level</Text>
              <Select value={levelFilter} onChange={(e) => setLevelFilter(e.target.value)} size="sm" w="auto" minW="6ch">
                <option value="">Any</option>
                {Array.from({ length: 12 }, (_, i) => 12 - i).map((lv) => (
                  <option key={`iidx-level-filter-${lv}`} value={`${lv}`}>
                    {lv}
                  </option>
                ))}
              </Select>
            </Box>
            <Box>
              <Text fontSize="xs">Rank</Text>
              <Select value={rankFilter} onChange={(e) => setRankFilter(e.target.value)} size="sm" w="auto" minW="6ch">
                <option value="">Any</option>
                {gradeOptions.map((g) => (
                  <option key={`iidx-rank-filter-${g}`} value={g}>
                    {g}
                  </option>
                ))}
              </Select>
            </Box>
            <Box>
              <Text fontSize="xs">Lamp</Text>
              <Select value={lampFilter} onChange={(e) => setLampFilter(e.target.value)} size="sm" w="auto" minW="8ch">
                <option value="">Any</option>
                {Object.entries(lampMap)
                  .sort((a, b) => Number(b[0]) - Number(a[0]))
                  .map(([k, v]) => (
                    <option key={`iidx-lamp-filter-${k}`} value={k}>
                      {v.abbr}
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

          {showLoading ? (
            <Text>Loading...</Text>
          ) : sortedScores.length === 0 ? (
            <Text>No Scores</Text>
          ) : (
            <Box
              ref={parentRef}
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
                bg={headerBg}
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
                  w="100%"
                  display="flex"
                  justifyContent="center"
                  cursor="pointer"
                  userSelect="none"
                  onClick={() => onToggleSort("chart")}
                  _hover={{ textDecoration: "underline" }}
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
                  display="flex"
                  justifyContent="center"
                  cursor="pointer"
                  userSelect="none"
                  onClick={() => onToggleSort("score")}
                  _hover={{ textDecoration: "underline" }}
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
                  display="flex"
                  justifyContent="flex-end"
                  textAlign="right"
                  pl={1}
                  cursor="pointer"
                  userSelect="none"
                  onClick={() => onToggleSort("timestamp")}
                  _hover={{ textDecoration: "underline" }}
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
                ref={scrollRef}
                flex="1"
                minH={0}
                overflowY="auto"
                overflowX="hidden"
                sx={{ scrollbarGutter: "stable" }}
                w="100%"
                position="relative"
                role="region"
                aria-label="IIDX scores list (scroll for more)"
              >
                <Box h={`${rowVirtualizer.getTotalSize()}px`} w="100%" position="relative">
                  {rowVirtualizer.getVirtualItems().map((vi) => {
                    const row = sortedScores[vi.index];
                    const music_id = row?.music_id;
                    const play_style = row?.play_style;
                    const chart_id = row?.chart_id;
                    const ex_score = row?.ex_score;
                    const clear_flg = row?.clear_flg;
                    const timestamp = row?.timestamp;

                    const difficultyIndex = play_style === 0 ? chart_id : chart_id + 5;
                    const chartType = difficultyMap?.[difficultyIndex]?.abbr?.slice(0, 3);
                    const abbr = difficultyMap?.[difficultyIndex]?.abbr;
                    const level = DDR_MDB?.[music_id]?.[abbr] ?? "??";
                    const grade = getGradeFromScore(notecounts, music_id, chartType, ex_score) || "??";

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
                          _hover={{ bg: rowHoverBg }}
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
                              {DDR_MDB?.[music_id]?.title || music_id}
                            </Text>
                          </Box>

                          <Box w="100%" display="flex" justifyContent="center">
                            <Badge color={cellTextColor} background="none" fontWeight="400" textAlign="center" whiteSpace="nowrap">
                              {chartType} {level}
                            </Badge>
                          </Box>

                          <HStack
                            justify="center"
                            spacing={1}
                            flexWrap={{ base: "wrap", md: "nowrap" }}
                            w="100%"
                            textAlign="center"
                          >
                            <Badge color={cellTextColor} background="none" fontWeight="400">
                              {grade}
                            </Badge>
                            <Tooltip
                              hasArrow
                              label={lampMap?.[clear_flg]?.text}
                              aria-label={lampMap?.[clear_flg]?.text}
                              placement="top-end"
                            >
                              <Badge
                                color={cellTextColor}
                                background="none"
                                minW="2.25rem"
                                textAlign="center"
                                fontWeight="400"
                                border={`0px solid rgb(${lampMap?.[clear_flg]?.rgb})`}
                              >
                                {lampMap?.[clear_flg]?.abbr}
                              </Badge>
                            </Tooltip>
                          </HStack>

                          <Box w="100%" display="flex" justifyContent="center">
                            <Badge color={cellTextColor} background="none" fontWeight="400" fontVariantNumeric="tabular-nums">
                              {`${ex_score} EX`}
                            </Badge>
                          </Box>

                          <Box w="100%" display="flex" justifyContent="flex-end" textAlign="right" pl={1}>
                            <Tooltip
                              hasArrow
                              label={getTimeSincePlayed(timestamp)}
                              aria-label={getTimeSincePlayed(timestamp)}
                              placement="top-end"
                            >
                              <Badge color={cellTextColor} background="none" fontWeight="400">
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
          </>
        )}
      </Box>
    </Box>
  </>
  );
};

export default IidxScoresSection;
