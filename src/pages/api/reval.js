export default async function handler(req, res) {
    const { path, secret } = req.query
    if (secret !== process.env.FAUSTWP_SECRET_KEY) {
        return res.status(401).json({ message: 'Invalid token' })
    }

    try {
        await res.revalidate(path)
        return res.json({ revalidated: true })
    } catch (err) {
        return res.status(500).send(`Error revalidating - ${err}`)
    }
}
