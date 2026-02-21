import useGame from "../useGame";
import { useNavigate } from "react-router-dom";
import { Grid } from "../components/grid";
import { Layout } from "../components/layout";
import { useRoundNumber } from "./useRoundNumber";
import { MainButton } from "../components/button";
import { RoundTitle } from "../components/title";
import { Menu } from "./menu";
import { dealForRound } from '../roundRules'

const Round = () => {
  const { getDealer } = useGame();
  const round = useRoundNumber();
  const { deal, books, runs } = dealForRound(round);
  const navigate = useNavigate();
  // TODO: Pick dealer from API somehow
  const dealer = getDealer()?.name || 'No Dealer';

  return (
    <Layout className="splash-screen">
      <Grid
        stack
        split
        style={{ minHeight: "var(--full-safe-height)" }}
        space={[20, 10, 40]}
      >
        <Menu fixed />
        <RoundTitle {...{ books, runs, deal, round, dealer }} />
        <MainButton onClick={() => navigate("scores")}>
          Record Scores
        </MainButton>
      </Grid>
    </Layout>
  );
};

export { Round };
