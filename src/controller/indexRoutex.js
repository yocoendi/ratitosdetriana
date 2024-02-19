
//VISTA PARA EL HOME/INDEX
export const vistaHome = (req, res) => {
    res.render('index', {title: 'Home'})
}

//VISTA PARA LA GALERIA
export const vistaGallery = (req, res) => {
    res.render('gallery', {title: 'Gallery'})
}

export const postMetodo = async (req, res) => {
    const [result] = await pool1.query('SELECT 1+1 as result')
    res.json(result[0])
}
