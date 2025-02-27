import { Button } from '@mui/material'
import style from '@styles/components/Search/Letters.module.scss'
import { ChangeEvent, FormEvent, useState } from 'react'

export default function SearchLetters({
	search,
	updateSearch,
}: {
	search: {
		id: string
		firstName: string
		lastName: string
	}
	updateSearch?: ({ ...args }) => void
}) {
	const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('')

	const [filter, setSearch] = useState({
		first_name: search.firstName,
		last_name: search.lastName,
	})

	function updateSearchOnSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault()

		updateSearch({
			...search,
			id: '',
			firstName: filter.first_name,
			lastName: filter.last_name,
		})
	}

	function handleInput(e: ChangeEvent<HTMLInputElement>) {
		setSearch({
			...filter,
			[e.currentTarget.name]: e.currentTarget.value,
		})
	}

	return (
		<div className={`search ${style.search}`}>
			<div className={style.alphabet}>
				<span className={style.label}>Sort by alphabetical listing</span>

				<div className={style.letters}>
					{alphabet.map((c, i) => {
						return (
							<Button
								key={i}
								className={search.id === c ? style.selected : ''}
								onClick={() =>
									updateSearch({
										...search,
										id: c,
										firstName: '',
										lastName: '',
									})
								}
							>
								{c}
							</Button>
						)
					})}
				</div>
			</div>

			<div className={style.name}>
				<span className={style.label}>search by name</span>

				<form className={style.inputs} onSubmit={updateSearchOnSubmit}>
					<input
						type="text"
						placeholder="First Name"
						name="first_name"
						value={filter.first_name}
						onChange={handleInput}
					/>

					<input
						type="text"
						placeholder="Last Name"
						name="last_name"
						value={filter.last_name}
						onChange={handleInput}
					/>

					<Button type="submit">Search</Button>
				</form>
			</div>
		</div>
	)
}
