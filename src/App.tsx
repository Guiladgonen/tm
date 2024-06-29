import { useEffect, useState } from 'react';
import bg from './assets/bg.png';
import logo from './assets/logo.svg';
import card1 from './assets/card_1.png';
import card2 from './assets/card_2.png';
import card3 from './assets/card_3.png';
import card4 from './assets/card_4.png';
import card5 from './assets/card_5.png';
import video from './assets/video_final.mp4';
import card1b from './assets/card_1b.png';
import card2b from './assets/card_2b.png';
import card3b from './assets/card_3b.png';
import card4b from './assets/card_4b.png';
import card5b from './assets/card_5b.png';
import { texts } from './texts';
import { setAsyncTimeout } from './setAsyncTimeOut';

const cardImage = [card1, card2, card3, card4, card5];
const cardImageBig = [card1b, card2b, card3b, card4b, card5b];

type Page = 1 | 2 | 3;

type Lives = 0 | 1 | 2 | 3 | 4;

type CardOption = 1 | 2 | 3 | 4 | 5;

const basicCards: CardOption[] = [1, 2, 4, 5, 1, 2, 4, 5];

function App() {
	// Types
	type CardIndex = keyof typeof cards;

	// States
	const [page, setPage] = useState<Page>(1);
	const [cards, setCards] = useState<CardOption[]>([]);
	const [selection, setSelection] = useState<[CardIndex?, CardIndex?]>([]);
	const [corrects, setCorrects] = useState<CardIndex[]>([]);
	const [lives, setLives] = useState<Lives>(4);
	const [winningCard, setWinningCard] = useState<CardOption>();
	const [infoText, setInfoText] = useState('');

	const selected1 = selection[0] === undefined ? undefined : cards[selection[0] as number];
	const selected2 = selection[1] === undefined ? undefined : cards[selection[1] as number];
	const equalSelection = selected1 != undefined && selected1 === selected2;
	console.log(cards);

	useEffect(() => {
		if (!selection.length) {
			return;
		}
		if (selection.length === 2) {
			if (equalSelection) {
				// Save winning card for next screen
				setWinningCard(selected1);
				// @ts-ignore (selection has never undefined elements)
				setCorrects([...corrects, ...selection]);
				// Restore table state
				setSelection([]);
				// Show wine description
				setTimeout(() => nextPage(), 1000);
			} else {
				// Show one more chance text when first attempt
				lives > 0 && setTimeout(() => setInfoText(`Tenés ${lives} chance${lives > 1 ? 's' : ''} más`), 1000);
				setAsyncTimeout(() => {
					// Unflip cards
					setSelection([]);
				}, 1500).then(() => {
					if (lives === 0) {
						// Show you loose message
						nextPage();
					} else {
						// Go for the next attempt
						setAsyncTimeout(() => {}, 700).then(() => {
							setInfoText('');
							setLives((lives - 1) as Lives);
						});
					}
				});
			}
		}
	}, [selection.length]);

	// Handles

	const handleFlip = (card: CardIndex) => () => {
		if (selection.includes(card) || corrects.includes(card)) {
			return;
		}
		if (selection.length < 2) {
			// @ts-ignore
			setSelection([...selection, card]);
		} else if (selection.length === 2) {
			return;
		}
	};

	const nextPage = (where?: Page) => {
		const newPage = where ?? (page === 3 ? 1 : page + 1);
		setPage(newPage as Page);
	};

	const playGame = () => {
		setCards(shuffleCards(basicCards));
		setPage(2);
		setLives(4);
		setCorrects([]);
		setWinningCard(undefined);
		setSelection([]);
	};
	const continueGame = () => {
		setWinningCard(undefined);
		nextPage(corrects.length === basicCards.length ? 3 : 2);
	};

	return (
		<div className="container">
			<div className="preLoad" style={{ opacity: 0 }}>
				<div style={{ fontFamily: 'LEMONMILKPro-Regular' }}>CARGANDO...</div>
				<div style={{ fontFamily: 'LEMONMILKPro-bold' }}>CARGANDO...</div>
				<div style={{ fontFamily: 'Futura-Medium' }}>CARGANDO...</div>
				<img src={card1} />
				<img src={card2} />
				<img src={card3} />
				<img src={card4} />
				<img src={card5} />
				<img src={card1b} />
				<img src={card2b} />
				<img src={card3b} />
				<img src={card4b} />
				<img src={card5b} />
				<img src={logo} />
			</div>
			<div className={`container2 ${window.location.hash === '#flip' ? 'flip' : ''}`}>
				{page === 2 ? (
					<div className="game">
						<div className="header">
							<h2>JUGÁ Y DESCUBRÍ TODAS</h2>
							<h1>NUESTRAS VARIEDADES</h1>
						</div>
						<div className="cards">
							{cards.map((card, i) => (
								<Card
									value={card}
									key={i}
									onFlip={handleFlip(i)}
									flipped={selection.includes(i) || corrects.includes(i)}
									color={(i < 14 ? i % 3 : (i + 1) % 3) as 1 | 2 | 3}
								/>
							))}
						</div>
						{Boolean(infoText) && <div className="infoText">{infoText}</div>}
					</div>
				) : page === 3 ? (
					<div className="description">
						{winningCard ? (
							<>
								<h3>Nuestros Vinos</h3>
								<div className="wineName">
									<h1>{texts[winningCard].category}</h1>
									<h2>{texts[winningCard].variety}</h2>
								</div>
								<img src={cardImageBig[winningCard - 1]} />
								{texts[winningCard].description.map((p) => (
									<p>{p}</p>
								))}
								<div className="buttonsWrapper">
									<div className="buttons">
										<div className="button buttonPlay" onClick={continueGame}>
											Continuar
										</div>
									</div>
								</div>
							</>
						) : (
							<>
								{corrects.length === basicCards.length ? (
									<>
										<h1>¡Ganaste,</h1>
										<h1>felicitaciones!</h1>
										<h1>&nbsp;</h1>
										<p>
											Te invitamos a recibir tu premio <br />y seguir disfrutando de nuestros vinos.
										</p>
									</>
								) : (
									<>
										<h1>Muchas gracias</h1>
										<h1>por participar.</h1>
										<h1>&nbsp;</h1>
										<p>Te invitamos a seguir disfrutando de nuestros vinos.</p>
									</>
								)}
								<h1>&nbsp;</h1>
								<div className="buttonsWrapper">
									<div className="buttons">
										<div className="button buttonPlay" onClick={() => playGame()}>
											Jugar
										</div>
										<div className="button buttonPlay" onClick={() => nextPage(1)}>
											Video
										</div>
									</div>
								</div>
							</>
						)}
					</div>
				) : (
					<div className="video" onClick={() => playGame()}>
						<video width="1920" height="1080" autoPlay muted loop>
							<source src={video} type="video/mp4" />
						</video>
						<div className="buttonsWrapper">
							<div className="button buttonPlay">Jugar</div>
						</div>
					</div>
				)}
				<div className="background" style={{ backgroundImage: `url(${bg})` }}></div>
			</div>
		</div>
	);
}
interface CardProps {
	value: CardOption;
	onFlip: () => void;
	flipped: boolean;
	color: 1 | 2 | 3;
}
function Card({ value, onFlip, flipped, color }: CardProps) {
	return (
		<div className={`card ${flipped ? 'flipped' : ''}`} onClick={onFlip}>
			<div className="card-body">
				<div className={`card-front color${color}`}>
					<img src={logo} />
				</div>
				<div className="card-back">
					<img src={cardImage[value - 1]} />
					<div className="card-back-text">{`${texts[value].category} ${texts[value].variety}`}</div>
				</div>
			</div>
		</div>
	);
}

/* Randomize array in-place using Durstenfeld shuffle algorithm */
function shuffleCards(cards: CardOption[]) {
	const array = [...cards];
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
	return array;
}

export default App;
