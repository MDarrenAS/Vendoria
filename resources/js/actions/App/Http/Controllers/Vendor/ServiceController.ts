import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Vendor\ServiceController::index
 * @see app/Http/Controllers/Vendor/ServiceController.php:22
 * @route '/vendor/services'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/vendor/services',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Vendor\ServiceController::index
 * @see app/Http/Controllers/Vendor/ServiceController.php:22
 * @route '/vendor/services'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Vendor\ServiceController::index
 * @see app/Http/Controllers/Vendor/ServiceController.php:22
 * @route '/vendor/services'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Vendor\ServiceController::index
 * @see app/Http/Controllers/Vendor/ServiceController.php:22
 * @route '/vendor/services'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Vendor\ServiceController::index
 * @see app/Http/Controllers/Vendor/ServiceController.php:22
 * @route '/vendor/services'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Vendor\ServiceController::index
 * @see app/Http/Controllers/Vendor/ServiceController.php:22
 * @route '/vendor/services'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Vendor\ServiceController::index
 * @see app/Http/Controllers/Vendor/ServiceController.php:22
 * @route '/vendor/services'
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
* @see \App\Http\Controllers\Vendor\ServiceController::create
 * @see app/Http/Controllers/Vendor/ServiceController.php:34
 * @route '/vendor/services/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/vendor/services/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Vendor\ServiceController::create
 * @see app/Http/Controllers/Vendor/ServiceController.php:34
 * @route '/vendor/services/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Vendor\ServiceController::create
 * @see app/Http/Controllers/Vendor/ServiceController.php:34
 * @route '/vendor/services/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Vendor\ServiceController::create
 * @see app/Http/Controllers/Vendor/ServiceController.php:34
 * @route '/vendor/services/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Vendor\ServiceController::create
 * @see app/Http/Controllers/Vendor/ServiceController.php:34
 * @route '/vendor/services/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Vendor\ServiceController::create
 * @see app/Http/Controllers/Vendor/ServiceController.php:34
 * @route '/vendor/services/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Vendor\ServiceController::create
 * @see app/Http/Controllers/Vendor/ServiceController.php:34
 * @route '/vendor/services/create'
 */
        createForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    create.form = createForm
/**
* @see \App\Http\Controllers\Vendor\ServiceController::store
 * @see app/Http/Controllers/Vendor/ServiceController.php:44
 * @route '/vendor/services'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/vendor/services',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Vendor\ServiceController::store
 * @see app/Http/Controllers/Vendor/ServiceController.php:44
 * @route '/vendor/services'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Vendor\ServiceController::store
 * @see app/Http/Controllers/Vendor/ServiceController.php:44
 * @route '/vendor/services'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Vendor\ServiceController::store
 * @see app/Http/Controllers/Vendor/ServiceController.php:44
 * @route '/vendor/services'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Vendor\ServiceController::store
 * @see app/Http/Controllers/Vendor/ServiceController.php:44
 * @route '/vendor/services'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Vendor\ServiceController::edit
 * @see app/Http/Controllers/Vendor/ServiceController.php:54
 * @route '/vendor/services/{service}/edit'
 */
export const edit = (args: { service: string | { slug: string } } | [service: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/vendor/services/{service}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Vendor\ServiceController::edit
 * @see app/Http/Controllers/Vendor/ServiceController.php:54
 * @route '/vendor/services/{service}/edit'
 */
edit.url = (args: { service: string | { slug: string } } | [service: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { service: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'slug' in args) {
            args = { service: args.slug }
        }
    
    if (Array.isArray(args)) {
        args = {
                    service: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        service: typeof args.service === 'object'
                ? args.service.slug
                : args.service,
                }

    return edit.definition.url
            .replace('{service}', parsedArgs.service.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Vendor\ServiceController::edit
 * @see app/Http/Controllers/Vendor/ServiceController.php:54
 * @route '/vendor/services/{service}/edit'
 */
edit.get = (args: { service: string | { slug: string } } | [service: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Vendor\ServiceController::edit
 * @see app/Http/Controllers/Vendor/ServiceController.php:54
 * @route '/vendor/services/{service}/edit'
 */
edit.head = (args: { service: string | { slug: string } } | [service: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Vendor\ServiceController::edit
 * @see app/Http/Controllers/Vendor/ServiceController.php:54
 * @route '/vendor/services/{service}/edit'
 */
    const editForm = (args: { service: string | { slug: string } } | [service: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Vendor\ServiceController::edit
 * @see app/Http/Controllers/Vendor/ServiceController.php:54
 * @route '/vendor/services/{service}/edit'
 */
        editForm.get = (args: { service: string | { slug: string } } | [service: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Vendor\ServiceController::edit
 * @see app/Http/Controllers/Vendor/ServiceController.php:54
 * @route '/vendor/services/{service}/edit'
 */
        editForm.head = (args: { service: string | { slug: string } } | [service: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    edit.form = editForm
/**
* @see \App\Http\Controllers\Vendor\ServiceController::update
 * @see app/Http/Controllers/Vendor/ServiceController.php:64
 * @route '/vendor/services/{service}'
 */
export const update = (args: { service: string | { slug: string } } | [service: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/vendor/services/{service}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\Vendor\ServiceController::update
 * @see app/Http/Controllers/Vendor/ServiceController.php:64
 * @route '/vendor/services/{service}'
 */
update.url = (args: { service: string | { slug: string } } | [service: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { service: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'slug' in args) {
            args = { service: args.slug }
        }
    
    if (Array.isArray(args)) {
        args = {
                    service: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        service: typeof args.service === 'object'
                ? args.service.slug
                : args.service,
                }

    return update.definition.url
            .replace('{service}', parsedArgs.service.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Vendor\ServiceController::update
 * @see app/Http/Controllers/Vendor/ServiceController.php:64
 * @route '/vendor/services/{service}'
 */
update.put = (args: { service: string | { slug: string } } | [service: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\Vendor\ServiceController::update
 * @see app/Http/Controllers/Vendor/ServiceController.php:64
 * @route '/vendor/services/{service}'
 */
update.patch = (args: { service: string | { slug: string } } | [service: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Vendor\ServiceController::update
 * @see app/Http/Controllers/Vendor/ServiceController.php:64
 * @route '/vendor/services/{service}'
 */
    const updateForm = (args: { service: string | { slug: string } } | [service: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Vendor\ServiceController::update
 * @see app/Http/Controllers/Vendor/ServiceController.php:64
 * @route '/vendor/services/{service}'
 */
        updateForm.put = (args: { service: string | { slug: string } } | [service: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\Vendor\ServiceController::update
 * @see app/Http/Controllers/Vendor/ServiceController.php:64
 * @route '/vendor/services/{service}'
 */
        updateForm.patch = (args: { service: string | { slug: string } } | [service: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
/**
* @see \App\Http\Controllers\Vendor\ServiceController::destroy
 * @see app/Http/Controllers/Vendor/ServiceController.php:78
 * @route '/vendor/services/{service}'
 */
export const destroy = (args: { service: string | { slug: string } } | [service: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/vendor/services/{service}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Vendor\ServiceController::destroy
 * @see app/Http/Controllers/Vendor/ServiceController.php:78
 * @route '/vendor/services/{service}'
 */
destroy.url = (args: { service: string | { slug: string } } | [service: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { service: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'slug' in args) {
            args = { service: args.slug }
        }
    
    if (Array.isArray(args)) {
        args = {
                    service: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        service: typeof args.service === 'object'
                ? args.service.slug
                : args.service,
                }

    return destroy.definition.url
            .replace('{service}', parsedArgs.service.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Vendor\ServiceController::destroy
 * @see app/Http/Controllers/Vendor/ServiceController.php:78
 * @route '/vendor/services/{service}'
 */
destroy.delete = (args: { service: string | { slug: string } } | [service: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Vendor\ServiceController::destroy
 * @see app/Http/Controllers/Vendor/ServiceController.php:78
 * @route '/vendor/services/{service}'
 */
    const destroyForm = (args: { service: string | { slug: string } } | [service: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Vendor\ServiceController::destroy
 * @see app/Http/Controllers/Vendor/ServiceController.php:78
 * @route '/vendor/services/{service}'
 */
        destroyForm.delete = (args: { service: string | { slug: string } } | [service: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const ServiceController = { index, create, store, edit, update, destroy }

export default ServiceController