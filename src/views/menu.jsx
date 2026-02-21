import { Grid } from "../components/grid";
import { Button } from "@ariakit/react";
import PropTypes from "prop-types";

import { useState } from "react";
import useGame from "../useGame";
import { useNavigate, useLocation } from "react-router-dom";
import { formatRoundOptionLabel } from "../roundRules";
import "./menu.css";

export const Menu = ({ fixed }) => {
	const { currentRound, getUnplayedRounds, selectNextRound } = useGame();
	const navigate = useNavigate();
	const location = useLocation();
	const [showMenu, setShowMenu] = useState(false);
	const [showRoundPicker, setShowRoundPicker] = useState(false);

	const closeMenu = () => {
		setShowMenu(false);
		setShowRoundPicker(false);
	};

	const toggleMenu = () => {
		if (showMenu) {
			closeMenu();
			return;
		}

		setShowMenu(true);
	};

	const editPlayers = () => {
		closeMenu();
		navigate("/players", { replace: true, state: { from: location.pathname } });
	};

	const newGame = () => {
		closeMenu();
		navigate("/new", { replace: true });
	};

	const changeRound = (round) => {
		closeMenu();
		if (round === currentRound) {
			return;
		}

		const updatedRound = selectNextRound(round);
		if (updatedRound === round) {
			navigate(`/round/${round}`, { replace: true });
		}
	};

	const unplayedRounds = getUnplayedRounds();

	return (
		<div className="menu" data-fixed={fixed || null}>
			<Button
				data-active={showMenu || null}
				aria-label="show menu"
				className="menu-button"
				onClick={toggleMenu}
			>
				<div className="menu-button-text" />
			</Button>
			{showMenu ? (
				<div className="menu-panel">
					{showRoundPicker ? (
						<Grid gap={20} className="menu-round-panel">
							<div className="menu-round-heading">Select Round</div>
							<Grid gap={12} className="menu-round-options">
								{unplayedRounds.map((round) => (
									<Button
										key={round}
										onClick={() => changeRound(round)}
										className="menu-round-option"
									>
										{formatRoundOptionLabel(round)}
									</Button>
								))}
							</Grid>
						</Grid>
					) : (
						<Grid gap={20} className="menu-panel-options" align="center">
							<Button onClick={newGame}>New Game</Button>
							<Button onClick={editPlayers}>Edit Players</Button>
							<Button onClick={() => setShowRoundPicker(true)}>
								Change Round
							</Button>
						</Grid>
					)}
				</div>
			) : null}
		</div>
	);
};

Menu.propTypes = {
	fixed: PropTypes.bool,
};
