import { useState, useEffect, useRef } from 'react';
import './play-css.css';
import { clear } from '@testing-library/user-event/dist/clear';


const SnakeGame = () => {
    const ROWS = 10;
    const COLS = 20;
    const CELL_SIZE = 30;
    const dir = [1, -20, 1, 20]
    var [level, setLevel] = useState(1)
    const initHashMap = (hashMap) => {
        for (let i = 1; i <= ROWS * COLS; i++) {
            hashMap[i] = 0
            const element = document.getElementById('_' + i)
            if (element) {
                element.style.backgroundColor = 'black'
            }

        }
    }

    const [hashMap, setHashMap] = useState(() => {
        const hash = {}
        initHashMap(hash)
        return hash
    })
    const getNextPosition = (snakeHead, delx) => {
        var newPos = 1;
        if (delx == 1 && snakeHead % 20 == 0) {
            newPos = (snakeHead - 19)
        }
        else if (delx == -1 && snakeHead % 20 == 1) {
            newPos = (snakeHead + 19)
        }
        else {
            newPos = (snakeHead + delx) % 200 == 0 ? 200 : (snakeHead + delx + 200) % 200
        }
        return newPos
    }
    const createSnake = () => {
        const length = Math.floor(level / 3 + 3)
        var head = Math.floor(Math.random() * COLS * ROWS)
        const dirIndex = Math.floor(Math.random() * 4)
        const direct = dir[dirIndex]
        const snakeDots = [head]
        hashMap[head]++

        for (let i = 1; i < length; i++) {
            const newHead = getNextPosition(head, -direct)
            snakeDots.unshift(newHead)
            head = newHead
            hashMap[newHead]++
        }
        return { dots: snakeDots, direction: direct }

    }
    const [snakes, setSnakes] = useState(() => {
        const a = createSnake(5)
        return [a]

    });
    const [diamondPosition, setDiamondPosition] = useState(Math.floor(Math.random() * COLS * ROWS));
    const [score, setScore] = useState(0);
    const [toggleGame, setToggleGame] = useState(1)
    const updatePosRef = useRef()
    const updateDirRef = useRef()


    useEffect(() => {

        placeSnake();
        placeDiamond();


    }, [diamondPosition, snakes])



    useEffect(() => {

        updateDirRef.current = updateDirection
        updatePosRef.current = updatePosition

    })



    useEffect(() => {
        const moveInterval = setInterval(() => { updatePosRef.current(); }, 1000)
        const direction = setInterval(() => { updateDirRef.current(); }, 5000)

        if (toggleGame == 0) {
            clearInterval(moveInterval)
            clearInterval(direction)
        }
        return () => { clearInterval(moveInterval); clearInterval(direction) }
    }, [toggleGame]);



    const placeDiamond = () => {
        const diamond = document.querySelector('.grid #_' + diamondPosition)
        diamond.style.backgroundColor = 'blue'
    }
    const removeDiamond = () => {
        const diamond = document.querySelector('.grid #_' + diamondPosition)
        diamond.style.backgroundColor = 'black'

    }
    const placeSnake = () => {

        for (let i = 1; i <= ROWS * COLS; i++) {
            const dot = document.querySelector('.grid #_' + i)

            if (hashMap[i] != 0) {
                dot.style.backgroundColor = 'red'
            }
            else dot.style.backgroundColor = 'black'
        }

    }


    const diamondClick = (e) => {
        if (!toggleGame) return
        const clicked = e.target
        if ((clicked.getAttribute('id')) == '_' + diamondPosition) {
            setScore(score + 10)
            setLevel(level + 1)
            removeDiamond()
            setDiamondPosition(Math.floor(Math.random() * COLS * ROWS))
            const temp = [...snakes]
            const newSnake = createSnake()
            temp.push(newSnake)
            setSnakes(temp)
        }

    }


    const updateDirection = () => {
        for (let i = 0; i < snakes.length; i++) {
            const dirArr = dir.filter((item) => {
                if (item != -snakes[i].direction && item != snakes[i].direction) { return true }
                else return false
            });
            const dirIndex = Math.floor(Math.random() * 2)
            snakes[i].direction = dirArr[dirIndex]

        }
    }
    const updatePosition = () => {

        const temp = [...snakes]
        for (let i = 0; i < temp.length; i++) {
            const head = temp[i].dots[temp[i].dots.length - 1]

            const direction = temp[i].direction
            const newHeadPos = getNextPosition(head, direction)
            hashMap[newHeadPos]++
            hashMap[temp[i].dots[0]]--

            temp[i].dots.push(newHeadPos)
            temp[i].dots.shift()


        }
        setSnakes(temp)
    }
    const reset = () => {
        setLevel(1)
        setScore(0)
        initHashMap(hashMap)
        level = 1
        const a = createSnake()
        removeDiamond()
        setDiamondPosition(Math.floor(Math.random() * COLS * ROWS))
        setSnakes([a])
        setToggleGame(0)
    }


    const handleMouseHover = (e) => {
        const hovered = e.target
        if (hovered == e.currentTarget) {
            return
        }
        hovered.style.backgroundColor = 'green'

        var id = hovered.getAttribute('id')
        id = id.slice(1)
        if (hashMap[id]) {
            setScore(score - 10)
        }


    }
    const handleMouseOut = (e) => {
        const hovered = e.target
        if (hovered == e.currentTarget) {
            return
        }

        var id = hovered.getAttribute('id')
        id = id.slice(1)
        if (hashMap[id]) {
            hovered.style.backgroundColor = 'red'

        }
        else if (id == diamondPosition) {
            hovered.style.backgroundColor = 'blue'


        }
        else { hovered.style.backgroundColor = 'black' }



    }


    return (
        <>
            <div onClick={diamondClick}
                onMouseOver={handleMouseHover}
                onMouseOut={handleMouseOut}
                className="grid"
                style={{
                    gridTemplateColumns: `repeat(${COLS}, ${CELL_SIZE}px)`,
                    gridTemplateRows: `repeat(${ROWS}, ${CELL_SIZE}px)`,
                }}
            >
                {Array.from({ length: ROWS * COLS }, (_, index) => (
                    < div key={index} id={'_' + (index + 1)} />
                ))}
            </div>

            <div>Score: {score}</div>
            <div>Level: {level}</div>
            <button onClick={() => { setToggleGame(1 - toggleGame) }}>{toggleGame ? 'Stop' : 'Start'}</button>
            <button onClick={reset}>Reset Game</button>

        </>
    );
};

export default SnakeGame;
