const endpoints = {
    auth: {
        register: '/auth/register',
        login: '/auth/login',
        me: '/auth/me',
    },
    products: {
        list: '/products',
        details: (id: number | string) => `/products/${id}`,
        create: '/products',
    },
    orders: {
        create: '/orders',
        my: '/orders/my',
        detail: (id: number | string) => `/orders/${id}`
    },
    payments: {
        create: '/payments',
    },
}

export default endpoints;