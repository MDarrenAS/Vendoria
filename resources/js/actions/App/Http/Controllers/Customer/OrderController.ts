import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Customer\OrderController::store
 * @see app/Http/Controllers/Customer/OrderController.php:123
 * @route '/orders'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/orders',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Customer\OrderController::store
 * @see app/Http/Controllers/Customer/OrderController.php:123
 * @route '/orders'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Customer\OrderController::store
 * @see app/Http/Controllers/Customer/OrderController.php:123
 * @route '/orders'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Customer\OrderController::store
 * @see app/Http/Controllers/Customer/OrderController.php:123
 * @route '/orders'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Customer\OrderController::store
 * @see app/Http/Controllers/Customer/OrderController.php:123
 * @route '/orders'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Customer\OrderController::index
 * @see app/Http/Controllers/Customer/OrderController.php:25
 * @route '/orders'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/orders',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Customer\OrderController::index
 * @see app/Http/Controllers/Customer/OrderController.php:25
 * @route '/orders'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Customer\OrderController::index
 * @see app/Http/Controllers/Customer/OrderController.php:25
 * @route '/orders'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Customer\OrderController::index
 * @see app/Http/Controllers/Customer/OrderController.php:25
 * @route '/orders'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Customer\OrderController::index
 * @see app/Http/Controllers/Customer/OrderController.php:25
 * @route '/orders'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Customer\OrderController::index
 * @see app/Http/Controllers/Customer/OrderController.php:25
 * @route '/orders'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Customer\OrderController::index
 * @see app/Http/Controllers/Customer/OrderController.php:25
 * @route '/orders'
 */
        indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index.form = indexForm
/**
* @see \App\Http\Controllers\Customer\OrderController::show
 * @see app/Http/Controllers/Customer/OrderController.php:56
 * @route '/orders/{order}'
 */
export const show = (args: { order: string | { order_number: string } } | [order: string | { order_number: string } ] | string | { order_number: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/orders/{order}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Customer\OrderController::show
 * @see app/Http/Controllers/Customer/OrderController.php:56
 * @route '/orders/{order}'
 */
show.url = (args: { order: string | { order_number: string } } | [order: string | { order_number: string } ] | string | { order_number: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { order: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'order_number' in args) {
            args = { order: args.order_number }
        }
    
    if (Array.isArray(args)) {
        args = {
                    order: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        order: typeof args.order === 'object'
                ? args.order.order_number
                : args.order,
                }

    return show.definition.url
            .replace('{order}', parsedArgs.order.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Customer\OrderController::show
 * @see app/Http/Controllers/Customer/OrderController.php:56
 * @route '/orders/{order}'
 */
show.get = (args: { order: string | { order_number: string } } | [order: string | { order_number: string } ] | string | { order_number: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Customer\OrderController::show
 * @see app/Http/Controllers/Customer/OrderController.php:56
 * @route '/orders/{order}'
 */
show.head = (args: { order: string | { order_number: string } } | [order: string | { order_number: string } ] | string | { order_number: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Customer\OrderController::show
 * @see app/Http/Controllers/Customer/OrderController.php:56
 * @route '/orders/{order}'
 */
    const showForm = (args: { order: string | { order_number: string } } | [order: string | { order_number: string } ] | string | { order_number: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Customer\OrderController::show
 * @see app/Http/Controllers/Customer/OrderController.php:56
 * @route '/orders/{order}'
 */
        showForm.get = (args: { order: string | { order_number: string } } | [order: string | { order_number: string } ] | string | { order_number: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Customer\OrderController::show
 * @see app/Http/Controllers/Customer/OrderController.php:56
 * @route '/orders/{order}'
 */
        showForm.head = (args: { order: string | { order_number: string } } | [order: string | { order_number: string } ] | string | { order_number: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
/**
* @see \App\Http\Controllers\Customer\OrderController::cancel
 * @see app/Http/Controllers/Customer/OrderController.php:97
 * @route '/orders/{order}'
 */
export const cancel = (args: { order: string | { order_number: string } } | [order: string | { order_number: string } ] | string | { order_number: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: cancel.url(args, options),
    method: 'delete',
})

cancel.definition = {
    methods: ["delete"],
    url: '/orders/{order}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Customer\OrderController::cancel
 * @see app/Http/Controllers/Customer/OrderController.php:97
 * @route '/orders/{order}'
 */
cancel.url = (args: { order: string | { order_number: string } } | [order: string | { order_number: string } ] | string | { order_number: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { order: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'order_number' in args) {
            args = { order: args.order_number }
        }
    
    if (Array.isArray(args)) {
        args = {
                    order: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        order: typeof args.order === 'object'
                ? args.order.order_number
                : args.order,
                }

    return cancel.definition.url
            .replace('{order}', parsedArgs.order.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Customer\OrderController::cancel
 * @see app/Http/Controllers/Customer/OrderController.php:97
 * @route '/orders/{order}'
 */
cancel.delete = (args: { order: string | { order_number: string } } | [order: string | { order_number: string } ] | string | { order_number: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: cancel.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Customer\OrderController::cancel
 * @see app/Http/Controllers/Customer/OrderController.php:97
 * @route '/orders/{order}'
 */
    const cancelForm = (args: { order: string | { order_number: string } } | [order: string | { order_number: string } ] | string | { order_number: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: cancel.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Customer\OrderController::cancel
 * @see app/Http/Controllers/Customer/OrderController.php:97
 * @route '/orders/{order}'
 */
        cancelForm.delete = (args: { order: string | { order_number: string } } | [order: string | { order_number: string } ] | string | { order_number: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: cancel.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    cancel.form = cancelForm
/**
* @see \App\Http\Controllers\Customer\OrderController::confirmPayment
 * @see app/Http/Controllers/Customer/OrderController.php:109
 * @route '/orders/{order}/payment'
 */
export const confirmPayment = (args: { order: string | { order_number: string } } | [order: string | { order_number: string } ] | string | { order_number: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: confirmPayment.url(args, options),
    method: 'post',
})

confirmPayment.definition = {
    methods: ["post"],
    url: '/orders/{order}/payment',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Customer\OrderController::confirmPayment
 * @see app/Http/Controllers/Customer/OrderController.php:109
 * @route '/orders/{order}/payment'
 */
confirmPayment.url = (args: { order: string | { order_number: string } } | [order: string | { order_number: string } ] | string | { order_number: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { order: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'order_number' in args) {
            args = { order: args.order_number }
        }
    
    if (Array.isArray(args)) {
        args = {
                    order: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        order: typeof args.order === 'object'
                ? args.order.order_number
                : args.order,
                }

    return confirmPayment.definition.url
            .replace('{order}', parsedArgs.order.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Customer\OrderController::confirmPayment
 * @see app/Http/Controllers/Customer/OrderController.php:109
 * @route '/orders/{order}/payment'
 */
confirmPayment.post = (args: { order: string | { order_number: string } } | [order: string | { order_number: string } ] | string | { order_number: string }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: confirmPayment.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Customer\OrderController::confirmPayment
 * @see app/Http/Controllers/Customer/OrderController.php:109
 * @route '/orders/{order}/payment'
 */
    const confirmPaymentForm = (args: { order: string | { order_number: string } } | [order: string | { order_number: string } ] | string | { order_number: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: confirmPayment.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Customer\OrderController::confirmPayment
 * @see app/Http/Controllers/Customer/OrderController.php:109
 * @route '/orders/{order}/payment'
 */
        confirmPaymentForm.post = (args: { order: string | { order_number: string } } | [order: string | { order_number: string } ] | string | { order_number: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: confirmPayment.url(args, options),
            method: 'post',
        })
    
    confirmPayment.form = confirmPaymentForm
const OrderController = { store, index, show, cancel, confirmPayment }

export default OrderController