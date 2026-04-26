/* eslint-disable no-unused-expressions */
import "./App.css";
import { useState } from "react";
import {
  Container,
  Box,
  Text,
  Heading,
  VStack,
  Flex,
  Tabs,
  TabList,
  Tab,
  useColorMode,
  Switch,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";

import DdrScoresSection from "./ddr/ddr-scores-section";
import DdrProfileSidebar from "./ddr/ddr-profile-sidebar";

import GfdmScoresSection from "./gfdm/gfdm-scores-section";
import GfdmProfileSidebar from "./gfdm/gfdm-profile-sidebar";

import IidxScoresSection from "./iidx/iidx-scores-section";
import IidxProfileSidebar from "./iidx/iidx-profile-sidebar";

import useGlobalData from "./global-data";

const DDR = 'DDR', GFDM = 'GFDM', IIDX = 'IIDX'
const games = [DDR, GFDM, IIDX]

function App() {

  const {
    getDdrProfilesQuery,
    getDdrScoresByProfileIdQuery,
    getGfdmProfilesQuery,
    getGfdmScoresByProfileIdQuery,
    getIidxProfilesQuery,
    getIidxScoresByProfileIdQuery,
    updateMainDDRSettingsMutation,
    updateMainGFDMSettingsMutation,
    onChangeStartupArc,
    saveAllDdr,
    saveAllGfdm,
    saveAllIidx,
    selectedDdrProfileId,
    setSelectedDdrProfileId,
    selectedGfdmProfileId,
    setSelectedGfdmProfileId,
    mainDDRSettings,
    setMainDDRSettings,
    mainGFDMSettings,
    setMainGFDMSettings,
    mainIIDXSettings,
    setMainIIDXSettings,
    selectedIidxProfileId,
    setSelectedIidxProfileId,
    ddrVersionKeys,
    selectedDdrVersionKey,
    setSelectedDdrVersionKey,
    ddrVersionSettings,
    setDdrVersionSettings,
    gfdmVersionKeys,
    selectedGfdmVersionKey,
    setSelectedGfdmVersionKey,
    gfdmVersionSettings,
    setGfdmVersionSettings,
    selectedGame,
    setSelectedGame,
    ddrJson,
    gfdmJson,
    iidxMusicById,
    updateMainIIDXSettingsMutation,
    iidxVersionKeys,
    iidxVersionSettings,
    setIidxVersionSettings,
    selectedIidxVersionKey,
    setSelectedIidxVersionKey,
    iidxNotecountsJson
  } = useGlobalData()


  const setSelectedDdrProfileIdHandler = (value) => {
    const next = value === "" ? null : value;
    setSelectedDdrProfileId(next);
    if (!next) setMainDDRSettings({ card: "", pin: "" });
  };
  const setNewDdrCardHandler = (newValue) => setMainDDRSettings((prev) => ({ ...prev, card: newValue }))
  const setNewDdrTimingDispHandler = (newValue) => setMainDDRSettings((prev) => ({ ...prev, timing_disp: newValue }))
  const setNewDdrPinHandler = (newValue) => setMainDDRSettings((prev) => ({ ...prev, pin: newValue }))

  const setSelectedGfdmProfileIdHandler = (value) => {
    const next = value === "" ? null : value;
    setSelectedGfdmProfileId(next);
    if (!next) setMainGFDMSettings({ card: "", pin: "" });
  };
  const setNewGfdmCardHandler = (newValue) => setMainGFDMSettings((prev) => ({ ...prev, card: newValue }))
  const setNewGfdmPinHandler = (newValue) => setMainGFDMSettings((prev) => ({ ...prev, pin: newValue }))

  const setSelectedIidxProfileIdHandler = (value) => {
    const next = value === "" ? null : value;
    setSelectedIidxProfileId(next);
    if (!next) setMainIIDXSettings({ card: "", pin: "" });
  };
  const setNewIidxCardHandler = (newValue) => setMainIIDXSettings((prev) => ({ ...prev, card: newValue }))
  const setNewIidxTimingDispHandler = (newValue) => setMainIIDXSettings((prev) => ({ ...prev, timing_disp: newValue }))
  const setNewIidxPinHandler = (newValue) => setMainDDRSettings((prev) => ({ ...prev, pin: newValue }))

  const onSelectGameHandler = (gameIndex) => {
    const nextGame = games[gameIndex];
    // Always clear the destination profile selection when entering DDR/IIDX
    // so it doesn't carry over when switching tabs (incl. from GFDM).
    if (nextGame === DDR) {
      setSelectedDdrProfileId(null);
      setMainDDRSettings({ card: "", pin: "" });
    }
    if (nextGame === IIDX) {
      setSelectedIidxProfileId(null);
      setMainIIDXSettings({ card: "", pin: "" });
    }
    if (nextGame === GFDM) {
      setSelectedGfdmProfileId(null);
      setMainGFDMSettings({ card: "", pin: "" });
    }

    setSelectedGame(nextGame);
  }
  const onChangeStartupArcHandler = (e) => onChangeStartupArc(e.target.files[0], selectedGame)

  const [showSidebar, setShowSidebar] = useState(true)
  /** Full browser width; inner flex row lets the scores table fill remaining space beside the sidebar */
  const maxWidth = "100%";
  /** Match scores max width so header + (optional sidebar) + scores share one centered block on large viewports */
  const SCORES_MAX_W = "60rem";
  const PROFILE_SIDEBAR_W = "9.75rem";
  const SIDEBAR_MAIN_GAP = "2rem";
  /** Sidebar visible: full row width = sidebar + gap + scores. Sidebar hidden (monkey click): same horizontal bounds as scores-only column */
  const activeScoresRowMaxW =
    selectedGame === DDR || selectedGame === IIDX || selectedGame === GFDM
      ? showSidebar
        ? { base: "100%", lg: `calc(${PROFILE_SIDEBAR_W} + ${SIDEBAR_MAIN_GAP} + ${SCORES_MAX_W})` }
        : { base: "100%", lg: SCORES_MAX_W }
      : "100%";
  const activeScoresRowMx =
    selectedGame === DDR || selectedGame === IIDX || selectedGame === GFDM ? { base: 0, lg: "auto" } : 0;

  const { colorMode, toggleColorMode } = useColorMode();


  const fileUploadText = {
    [DDR]: 'select startup.arc to load metadata',
    [IIDX]: 'select music_data.bin to load metadata',
    [GFDM]: 'select gitadora mdb_.xml to load metadata'
  }[selectedGame]

  const onClickMonkey = () => setShowSidebar(prev => !prev)

  return (
    <Box minH="100vh" w="100%" bg="bg.canvas" color="fg.default">
    <VStack
      maxW={maxWidth}
      w="100%"
      backgroundColor="transparent"
      margin={"0 auto"}
      padding="1rem"
      align="left"
    >
      <Box w="100%" maxW={activeScoresRowMaxW} mx={activeScoresRowMx}>
      <Flex
        w="100%"
        padding="0"
        backgroundColor="transparent"
        mb="1rem"
        justify="space-between"
        alignItems="center"
        borderBottom="1px solid"
        borderColor="border.subtle"
        gap={3}
        flexWrap="wrap"
      >
        <Heading onClick={onClickMonkey} fontSize="4rem" mb="0.75rem" _hover={{ filter: 'saturate(200%)' }} transition={'filter 0.25s ease-in-out'} userSelect={'none'}>🐵</Heading>
        <Tabs onChange={onSelectGameHandler}>
          <TabList>
            {games.map(game => <Tab key={`game-${game}`}>{game}</Tab>)}
          </TabList>
        </Tabs>
        <FormControl display="flex" alignItems="center" w="auto" flexShrink={0}>
          <FormLabel htmlFor="app-color-mode" mb="0" fontSize="xs" whiteSpace="nowrap" me={2}>
            Dark mode
          </FormLabel>
          <Switch
            id="app-color-mode"
            size="sm"
            isChecked={colorMode === "dark"}
            onChange={toggleColorMode}
            aria-label="Toggle dark mode"
          />
        </FormControl>
        <Box width="14rem" flexShrink={0}>
          <input
            type="file"
            placeholder="select startup.arc"
            onChange={onChangeStartupArcHandler}
            style={{ fontSize: "0.75rem" }}
            disabled={selectedGame === GFDM}
          />
          <Text fontSize="xs">{fileUploadText}</Text>
        </Box>
      </Flex>
      </Box>
      <Container maxW={maxWidth} w="100%" padding="0">
        <Box w="100%" maxW={activeScoresRowMaxW} mx={activeScoresRowMx}>
        <Flex w="100%" align="flex-start" gap={showSidebar ? SIDEBAR_MAIN_GAP : 0}>
          <Box backgroundColor="transparent" w={PROFILE_SIDEBAR_W} flexShrink={0} display={showSidebar ? 'block' : 'none'} minH="100%" >
            {
              selectedGame === IIDX ? <IidxProfileSidebar
                saveAll={saveAllIidx}
                newPin={mainIIDXSettings?.pin}
                setNewPin={setNewIidxPinHandler}
                // newTimingDisp={verse}
                setNewTimingDisp={setNewIidxTimingDispHandler}
                profiles={getIidxProfilesQuery?.data?.data}
                newCard={mainIIDXSettings?.card}
                setNewCard={setNewIidxCardHandler}
                selectedProfileId={selectedIidxProfileId}
                setSelectedProfileId={setSelectedIidxProfileIdHandler}
                versionKeys={iidxVersionKeys}
                selectedVersionKey={selectedIidxVersionKey}
                setSelectedVersionKey={setSelectedIidxVersionKey}
                versionSettings={iidxVersionSettings}
                setVersionSettings={setIidxVersionSettings}
                savingInProgress={updateMainIIDXSettingsMutation.inProgress}
              /> : selectedGame === DDR ? <DdrProfileSidebar
                saveAllDdr={saveAllDdr}
                newPin={mainDDRSettings?.pin}
                setNewPin={setNewDdrPinHandler}
                // newTimingDisp={verse}
                setNewTimingDisp={setNewDdrTimingDispHandler}
                profiles={getDdrProfilesQuery?.data?.data}
                newCard={mainDDRSettings?.card}
                setNewCard={setNewDdrCardHandler}
                selectedDdrProfileId={selectedDdrProfileId}
                setSelectedDdrProfileIdHandler={setSelectedDdrProfileIdHandler}
                ddrVersionKeys={ddrVersionKeys}
                selectedDdrVersionKey={selectedDdrVersionKey}
                setSelectedDdrVersionKey={setSelectedDdrVersionKey}
                ddrVersionSettings={ddrVersionSettings}
                setDdrVersionSettings={setDdrVersionSettings}
                savingInProgress={updateMainDDRSettingsMutation.inProgress}
              /> : selectedGame === GFDM ? <GfdmProfileSidebar
                saveAllGfdm={saveAllGfdm}
                newPin={mainGFDMSettings?.pin}
                setNewPin={setNewGfdmPinHandler}
                // newTimingDisp={verse}
                // setNewTimingDisp={setNewGfdmTimingDispHandler}
                profiles={getGfdmProfilesQuery?.data?.data}
                newCard={mainGFDMSettings?.card}
                setNewCard={setNewGfdmCardHandler}
                selectedGfdmProfileId={selectedGfdmProfileId}
                setSelectedGfdmProfileIdHandler={setSelectedGfdmProfileIdHandler}
                gfdmVersionKeys={gfdmVersionKeys}
                selectedGfdmVersionKey={selectedGfdmVersionKey}
                setSelectedGfdmVersionKey={setSelectedGfdmVersionKey}
                gfdmVersionSettings={gfdmVersionSettings}
                setGfdmVersionSettings={setGfdmVersionSettings}
                savingInProgress={updateMainGFDMSettingsMutation.inProgress}
              /> :
                <></>
            }
          </Box>

          <Box
            backgroundColor="transparent"
            flex="1"
            minW={0}
            w="100%"
            height="100%"
            ml={showSidebar ? "2rem" : 0}
          >
            {
              selectedGame === IIDX
                ? <IidxScoresSection
                  selectedProfileId={selectedIidxProfileId}
                  getScoresQuery={getIidxScoresByProfileIdQuery}
                  notecounts={iidxNotecountsJson}
                  DDR_MDB={iidxMusicById ?? {}}
                /> :
                selectedGame === DDR
                  ? <DdrScoresSection
                    selectedDdrProfileId={selectedDdrProfileId}
                    getScoresQuery={getDdrScoresByProfileIdQuery}
                    DDR_MDB={ddrJson}
                  /> :
                  selectedGame === GFDM
                    ? <GfdmScoresSection
                      selectedGfdmProfileId={selectedGfdmProfileId}
                      getScoresQuery={getGfdmScoresByProfileIdQuery}
                      DDR_MDB={gfdmJson}
                    /> :
                    <></>
            }
          </Box>
        </Flex>
        </Box>
      </Container>
    </VStack>
    </Box>
  );
}

export default App;
