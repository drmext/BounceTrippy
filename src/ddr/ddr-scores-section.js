import {
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Heading,
  Text,
  Badge,
  Tooltip,
  Flex,
  Box,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
} from "@chakra-ui/react";
import { DateTime, Interval } from "luxon";
import { useEffect, useState } from "react";
import InfiniteScroll from 'react-infinite-scroller';

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
        {DDR_MDB?.[mcode]?.diffLv?.[difficulty] || "??"}
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
      {DDR_MDB?.[mcode]?.diffLv?.[difficulty] || "??"}
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

const DdrScoresSection = ({ selectedDdrProfileId, getScoresQuery, DDR_MDB }) => {

  const PAGE_SIZE = 50

  const [page, setPage] = useState(0)

  const [rows, setRows] = useState([])

  useEffect(() => {
    if (selectedDdrProfileId) {
      setRows([])
    }

  }, [selectedDdrProfileId])


  const updateDataFromLocalData = () => {

    const newPage = page + 1

    setPage(newPage)
    if (newPage > 0) {
      const sortedData = getScoresQuery?.data?.data?.sort((a, b) => b.timestamp - a.timestamp)

      const newScores = sortedData?.length > PAGE_SIZE ? sortedData?.slice(0, (newPage + 1) * PAGE_SIZE) : sortedData
      setRows(newScores)
    }
  }



  useEffect(() => {
    if (!getScoresQuery.rows?.length) {
      const sortedData = getScoresQuery?.data?.data?.sort((a, b) => b.timestamp - a.timestamp)
      if (!sortedData) return
      const newScores = sortedData?.length > PAGE_SIZE ? sortedData?.slice(0, PAGE_SIZE) : sortedData
      setRows(newScores)
    }
  }, [getScoresQuery])


  const { isOpen, onOpen, onClose } = useDisclosure()

  const [selectedRow, setSelectedRow] = useState(null)

  const onOpenModal = (row) => {
    setSelectedRow(row)
    onOpen()
  }

  const onCloseModal = () => {
    setSelectedRow(null)
    onClose()
  }

  const RefreshIcon = ({ ...args }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...args}><path d="M12 4C14.5905 4 16.8939 5.23053 18.3573 7.14274L16 9.5H22V3.5L19.7814 5.71863C17.9494 3.452 15.1444 2 12 2 6.47715 2 2 6.47715 2 12H4C4 7.58172 7.58172 4 12 4ZM20 12C20 16.4183 16.4183 20 12 20 9.40951 20 7.10605 18.7695 5.64274 16.8573L8 14.5 2 14.5V20.5L4.21863 18.2814C6.05062 20.548 8.85557 22 12 22 17.5228 22 22 17.5228 22 12H20Z"></path></svg>


  return (
    <>
      <Heading size="md" textAlign="left" mb="0.5rem">
        Scores <Button onClick={getScoresQuery.refetch} variant='ghost' fontSize="1.25rem" padding='0.5rem'><RefreshIcon width='1rem' /></Button>
      </Heading>
      <Box width="100%">
        {!selectedDdrProfileId || getScoresQuery?.isError ? (
          <Text>No Scores</Text>
        ) : getScoresQuery?.isLoading || !rows?.length || getScoresQuery?.isRefetching ? (
          <Text>Loading...</Text>
        ) : (
          <TableContainer>
            <Table variant="simple">

              <InfiniteScroll
                pageStart={0}
                // loadMore={loadFunc}
                hasMore={page + 1 * PAGE_SIZE < getScoresQuery?.data?.data?.length}
                // hasMore={true}
                dataLength={getScoresQuery?.data?.data?.length}
                loadMore={updateDataFromLocalData}
                endMessage={<p>ALl Set!</p>}
                loader={<div className="loader" key={0}>Loading ...</div>}
              >
                <Thead>
                  <Tr>
                    <Th>Song</Th>
                    <Th>Chart</Th>
                    <Th>Rank / Lamp</Th>
                    <Th textAlign="right">Score</Th>
                    <Th textAlign="right">Timestamp</Th>
                  </Tr>
                </Thead>
                <Tbody>

                  {rows?.map(
                    (row) => {
                      const {
                        mcode,
                        difficulty,
                        score,
                        exscore,
                        lamp,
                        timestamp,
                        rank,
                      } = row
                      return (
                        <Tr borderLeft={`4px solid white`} _hover={{ borderLeft: `4px solid rgb(${lampMap?.[lamp]?.rgb})`, backgroundColor: '#EEE', cursor: 'pointer' }} onClick={() => onOpenModal(row)} key={`ddr-score-${mcode}- ${timestamp} `}>
                          <Td width="20rem">
                            <Tooltip
                              hasArrow
                              label={DDR_MDB?.[mcode]?.artist || "MCODE"}
                              aria-label={DDR_MDB?.[mcode]?.artist || "MCODE"}
                              placement="top-start"
                            >
                              <Text
                                color="black"
                                background="none"
                                fontWeight="400"

                                whiteSpace="nowrap"
                                overflow="hidden"
                                textOverflow="ellipsis"
                              >
                                {DDR_MDB?.[mcode]?.title || mcode}
                              </Text>
                            </Tooltip>
                          </Td>
                          <Td >
                            <Badge color="black" background="none" fontWeight="400">
                              {formatDifficulty(DDR_MDB, mcode, difficulty)}
                            </Badge>
                          </Td>
                          <Td>
                            <Badge
                              color="black"
                              background="none"
                              border={`0px solid rgb(${rankMap[rank].rgb})`}
                              width="2.25rem"
                              textAlign="center"
                              fontWeight="400"
                            >
                              {rankMap[rank].text}
                            </Badge>

                            <Tooltip
                              hasArrow
                              label={
                                ![lampMap["3"].text, lampMap["1"].text].includes(
                                  lampMap?.[lamp]?.text
                                ) && lampMap?.[lamp]?.text
                              }
                              aria-label={
                                ![lampMap["3"].text, lampMap["1"].text].includes(
                                  lampMap?.[lamp]?.text
                                ) && lampMap?.[lamp]?.text
                              }
                              placement="top-end"
                            >
                              <Badge
                                color="black"
                                background="none"
                                width="4rem"
                                textAlign="center"
                                fontWeight="400"
                                border={`0px solid rgb(${lampMap?.[lamp]?.rgb})`}
                              >
                                {lampMap?.[lamp]?.abbr}
                              </Badge>
                            </Tooltip>
                          </Td>
                          <Td textAlign="right">
                            <Tooltip
                              hasArrow
                              label={`${exscore} EX`}
                              aria-label={`${exscore} EX`}
                              placement="top-end"
                            >
                              <Badge color="black" background="none" fontWeight="400">
                                {score.toLocaleString("en-US")}
                              </Badge>
                            </Tooltip>
                          </Td>
                          <Td textAlign="right">
                            <Tooltip
                              hasArrow
                              label={getTimeSincePlayed(timestamp)}
                              aria-label={getTimeSincePlayed(timestamp)}
                              placement="top-end"
                            >
                              <Badge color="black" background="none" fontWeight="400">
                                {formatTimestamp(timestamp)}
                              </Badge>
                            </Tooltip>
                          </Td>
                        </Tr>
                      )
                    }
                  )}
                </Tbody>
              </InfiniteScroll>
            </Table >
          </TableContainer >
        )}
      </Box >
      {selectedRow ? <TopScoresModal DDR_MDB={DDR_MDB} isOpen={isOpen} onClose={onCloseModal} rowData={selectedRow} /> : null}
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
  return (<Flex background={isDark ? '#000' : '#fff'} color={isDark ? '#fff' : '#000'} {...props}>
    <Flex flex={4} justify='flex-start'>{leftColumn}</Flex>
    <Flex flex={2} justify='flex-end' {...labelStyle}>{label}</Flex>
    <Flex flex={2} justify='flex-end'>{value}</Flex>
    <Flex flex={4} justify='flex-end'>{rightColumn}</Flex>
  </Flex >)
}
const TopScoresModal = ({ DDR_MDB, isOpen, onClose, rowData }) => {

  const ghostLength = rowData?.ghostsize
  const ghostNotes = rowData?.ghost.substring(0, ghostLength)?.split('')

  const mdbData = DDR_MDB?.[rowData?.mcode]
  const title = mdbData?.title || rowData?.mcode
  const artist = mdbData?.artist || '??'

  if (!ghostNotes) return

  return <Modal isOpen={isOpen} onClose={onClose} isCentered>
    <ModalOverlay />
    <ModalContent width='30rem' pt="1rem" pb='1rem'>
      <ModalCloseButton />
      <ModalBody>
        <Flex display='flex' direction='column' align='center'>
          {/* {Object.values(rowFieldColorMap).map(({ key, label }) => <Flex><Text width='6rem' textAlign='right' mr='0.5rem'>{label}:</Text> <Text width='6rem'>{rowData?.[key]}</Text> </Flex>)} */}
          <Flex direction='column' align='center' mb='0.5rem' mt="1rem">
            <Text fontSize='0.875rem' fontWeight={'bold'}>{title}</Text>
            <Text fontSize='0.75rem' fontWeight={'bold'}>{artist}</Text>
          </Flex>

          <Box height='1px' width='75%' background='linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(0,0,0,1) 50%, rgba(255,255,255,1) 100%)' />
          <Flex fontSize='0.75rem' direction='column' align='center' mb='1rem' mt="1rem" fontWeight='bold'>
            <Text>{formatDifficulty(DDR_MDB, rowData?.mcode, rowData?.difficulty, true)}</Text>
            <Text></Text>
            <Text>{`${rankMap[rowData?.rank].text} ${lampMap[rowData?.lamp].abbr}`}</Text>
            <Text>{rowData?.score.toLocaleString()}</Text>
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



          <NoteVisualization notes={ghostNotes} />

        </Flex>
      </ModalBody>
    </ModalContent>
  </Modal >
}


const CustomTooltip = ({ children, label, ...rest }) => {
  const [show, setShow] = useState(false)
  return (
    <Box
      position="relative"
      display="inline-block"
      onMouseEnter={e => setShow(true)}
      onMouseLeave={e => setShow(false)}
    >
      {children}
      <Box
        visibility={show ? "visible" : 'hidden'}
        bg="gray"
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
        border='1px solid #000'
        {...rest}
      >
        {label}
      </Box>
    </Box>
  );
};

const NoteVisualization = ({ notes = [] }) => {
  return (
    <Flex width='25rem' height='2rem' mt='1rem' >
      {
        notes.map((note, index) => {
          const noteData = noteGradeColorMap?.[note]
          return (
            <CustomTooltip label={`${index}: ${noteData?.label}`} placement="top"
              bg={noteData?.color}
              color={noteData?.color === '#f00' ? '#fff' : "#000"}>
              <Box width={`calc(25rem / ${notes.length})`} height='2rem' backgroundColor={noteData?.color} />
            </CustomTooltip>
          )
        })
      }
    </Flex >
  )

}

export default DdrScoresSection;
