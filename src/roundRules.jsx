const countBooksAndRuns = (number) => {
	let books = 0;
	let runs = 0;

	while (number > 0) {
		if (number >= 4) {
			if (number % 4 === 0) {
				runs++;
				number -= 4;
			} else {
				books++;
				number -= 3;
			}
		} else {
			if (number === 3) {
				books++;
			}
			number = 0;
		}
	}

	return { books, runs };
};

export const dealForRound = (roundNumber) => {
	if (roundNumber === 7) {
		return { deal: 13, runs: 3 };
	}

	if (roundNumber === 8) {
		return { deal: 13, books: 4, runs: 3 };
	}

	const deal = 6 + roundNumber;
	return { deal, ...countBooksAndRuns(deal - 1) };
};

export const formatRoundOptionLabel = (roundNumber) => {
	const { deal, books, runs } = dealForRound(roundNumber);
	const goals = [];

	if (books) {
		goals.push(`${books}B`);
	}

	if (runs) {
		goals.push(`${runs}R`);
	}

	return (
		<>
			<span className="menu-round-number">{roundNumber}.</span>
			<span className="menu-round-cards">{deal} CARDS</span>
			<span className="menu-round-hand">{goals.join(" ")}</span>
		</>
	);
};
