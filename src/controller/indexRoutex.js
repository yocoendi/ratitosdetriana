
//VISTA PARA EL HOME/INDEX
export const vistaHome = (req, res) => {
    res.render('index', {title: 'Home'})
}

//VISTA PARA EL LOGIN
export const vistaLogin = (req, res) => {
    res.render('login', {title: 'Login'})
}

//VISTA PARA EL LOGOUT
export const vistaLogout = (req, res) => {
    res.render('logout', {title: 'Logout'})
}


//VISTA PARA EL DASHBOARD
export const vistaDashboard = (req, res) => {
    res.render('dashboard', { title: 'Dashboard'})
}


//VISTA PARA EL REGISTRO DE ADMIN
export const vistaRegistro = (req, res) => {
    res.render('registro', {title: 'Admin'})
}
//VISTA PARA MODIFICAR EL ADMIN
export const vistaUpdateAdmin = (req, res) => {
    res.render('updateAdmin')
}


//VISTA PARA REGISTRAR EMPLEADOS
export const vistaEmpleados = (req, res) => {
    res.render('empleados',  {title: 'Empleados'})
}
//VISTA PARA MODIFICAR EMPLPEADOS
export const vistaUpdate = (req, res) => {
    res.render('updateEmpleados')
}

//VISTA PARA REGISTRAR RESTAURANTES
export const vistaRestaurantes = (req, res) => {
    res.render('restaurantes', {title: 'Restaurantes'})
}
//VISTA PARA MODIFICAR RESTAURANTES
export const vistaUpdateRestaurantes = (req, res) => {
    res.render('updateRestaurantes')
}

//VISTA PARA REGISTRAR FACTURAS
export const vistaFacturas = (req, res) => {
    res.render('facturas', {title: 'Facturas'})
}

//VISTA PARA MODIFICAR FACTURAS
export const vistaUpdateFacturas = (req, res) => {
    res.render('updatefacturas')
}

//VISTA PARA REGISTRAR PROVEEDORES
export const vistaProveedores = (req, res) => {
    res.render('proveedores', {title: 'Proveedores'})
}

//VISTA PARA MODIFICAR PROVEEDORES
export const vistaUpdateProveedores = (req, res) => {
    res.render('updateProveedores')
}

//VISTA PARA REGISTRAR CLIENTES
export const vistaClientes = (req, res) => {
    res.render('clientes', {title: 'Proveedores'})
}

//VISTA PARA MODIFICAR CLIENTES
export const vistaUpdateClientes = (req, res) => {
    res.render('updateClientes')
}


//VISTA PARA SUSCRIBIRSE
export const vistaCvnews = (req, res) => {
    res.render('cvnews', {title: 'Cvnews'})
}


//VISTA PARA LA GALERIA
export const vistaGallery = (req, res) => {
    res.render('gallery', {title: 'Gallery'})
}





export const postMetodo = async (req, res) => {
    const [result] = await pool1.query('SELECT 1+1 as result')
    res.json(result[0])
}
