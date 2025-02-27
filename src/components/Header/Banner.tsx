import style from '@styles/components/Header/Banner.module.scss'

export default function Banner() {
	return (
		<>
			<div className={style.banner}>
				Proudly Voted #1 City Club in the Country{' '}
				<span className="years">2012 • 2014 • 2016 • 2018 • 2020 • 2022</span>
			</div>
		</>
	)
}
