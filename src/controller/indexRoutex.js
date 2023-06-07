export const vistaHome = (req, res) => {
    res.render('index', {title: 'Home'})
}

export const vistaLogin = (req, res) => {
    res.render('login', {title: 'Login'})
}

export const vistaRegistro = (req, res) => {
    res.render('registro', {title: 'Registro'})
}

export const vistaSuscribirse = (req, res) => {
    res.render('suscribirse', {title: 'Suscribirse'})
}

export const vistaDashboard = (req, res) => {
    res.render('dashboard', {title: 'Dashboard'})
}

export const vistaGallery = (req, res) => {
    res.render('gallery', {title: 'Gallery'})
}
export const vistaLogout = (req, res) => {
    res.render('logout', {title: 'Logout'})
}

export const postMetodo = async (req, res) => {
    const [result] = await pool1.query('SELECT 1+1 as result')
    res.json(result[0])
}
