import useOnMounted from '@archipress/hooks/useMounted'
import { imageMaps } from '@archipress/constants/imageMaps'
import { useRef, useState } from 'react'
import style from '@styles/components/ImageMap.module.scss'

export default function ImageMap({
	slug,
	changeSlug,
}: {
	slug: string
	changeSlug: (slug: string) => void
}) {

	const canvas = useRef<HTMLCanvasElement>()
	const image = useRef<HTMLImageElement>()

	const mounted = useOnMounted()

	const [state, setState] = useState({
		mapSlug: '',
		selected: imageMaps.find(item => item.name === slug),
		mouseCoords: [],
		currentMap: [],
		hovering: false,
	})

	if (mounted) {
		if (!canvas.current) return null

		initCanvas()
	}

	function initCanvas() {
		if (!canvas || !image.current)
			return console.info('No image or canvas found')
		canvas.current.width = image.current.naturalWidth
		canvas.current.height = image.current.naturalHeight
		drawSelected()
	}

	function detectHover(coords: { x: number; y: number }) {
		if (!state.selected) return

		for (const map of Object.values(state.selected.map)) {
			const [x, y, w, h] = map.coords
			if (coords.x >= x && coords.x <= w && coords.y >= y && coords.y <= h) {
				canvas.current.style.cursor = 'pointer'

				clearCanvas()
				drawRectToCanvas(map.coords)
				setState({
					...state,
					mouseCoords: map.coords,
					mapSlug: map.slug,
				})

				return
			} else {
				clearCanvas()

				setState({
					...state,
					mouseCoords: null,
				})

				canvas.current.style.cursor = 'unset'
			}
		}
	}

	function drawRectToCanvas(coords: number[]) {
		if (state.hovering) return

		setState({
			...state,
			hovering: true,
		})

		if (!canvas.current || !image.current)
			return console.info('No image or canvas found')
		canvas.current.width = image.current.naturalWidth
		canvas.current.height = image.current.naturalHeight
		const [x, y, w, h] = coords
		const ctx = canvas.current.getContext('2d')

		ctx.fillStyle = 'lightgray'
		ctx.fillRect(x, y, Math.abs(w - x), Math.abs(h - y))

		drawSelected()
	}

	// function drawBackground() {
	// 	drawSelected()
	// 	const ctx = canvas.current.getContext('2d')
	// 	const background = new Image()
	// 	background.src = image.current.src
	// 	ctx.drawImage(background, 0, 0)
	// }

	function clearCanvas() {
		if (!state.hovering) return

		setState({
			...state,
			hovering: false,
		})
		if (!canvas.current || !image.current)
			return console.info('No image or canvas found')
		canvas.current.width = image.current.width
		const ctx = canvas.current.getContext('2d')
		ctx.clearRect(0, 0, canvas.current.width, canvas.current.height)
		drawSelected()
	}

	const getMousePos = (e: MouseEvent) => {
		const c = e.currentTarget as HTMLCanvasElement
		const evt = e
		const rect = c.getBoundingClientRect()
		const scaleX = c.width / rect.width
		const scaleY = c.height / rect.height

		detectHover({
			x: (evt.clientX - rect.left) * scaleX,
			y: (evt.clientY - rect.top) * scaleY,
		})
	}

	function drawSelected() {
		if (!state.currentMap) return
		const ctx = canvas.current.getContext('2d')
		const [x, y, w, h] = state.currentMap
		ctx.fillStyle = '#e7b508'
		ctx.fillRect(x, y, Math.abs(w - x), Math.abs(h - y))
	}

	function setMapSlug() {
		if (state.mouseCoords)
			setState({
				...state,
				currentMap: state.mouseCoords,
			})
		clearCanvas()
		if (!state.mapSlug || state.mapSlug === '') return

		changeSlug(state.mapSlug)
	}

	return (
		<>
			{state.selected ? (
				<div className={style.imageMapWrap}>
					<picture>
						<img
							ref={image}
							src={state.selected.img.src}
							alt={state.selected.name}
						/>
					</picture>
					<canvas
						ref={canvas}
						className="image-map"
						onMouseMove={e => getMousePos(e as any)}
						onClick={setMapSlug}
					/>
				</div>
			) : null}
		</>
	)
}
