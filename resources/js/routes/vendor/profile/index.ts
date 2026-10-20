import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Vendor\ProfileController::edit
 * @see app/Http/Controllers/Vendor/ProfileController.php:16
 * @route '/vendor/profile'
 */
export const edit = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/vendor/profile',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Vendor\ProfileController::edit
 * @see app/Http/Controllers/Vendor/ProfileController.php:16
 * @route '/vendor/profile'
 */
edit.url = (options?: RouteQueryOptions) => {
    return edit.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Vendor\ProfileController::edit
 * @see app/Http/Controllers/Vendor/ProfileController.php:16
 * @route '/vendor/profile'
 */
edit.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Vendor\ProfileController::edit
 * @see app/Http/Controllers/Vendor/ProfileController.php:16
 * @route '/vendor/profile'
 */
edit.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Vendor\ProfileController::edit
 * @see app/Http/Controllers/Vendor/ProfileController.php:16
 * @route '/vendor/profile'
 */
    const editForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Vendor\ProfileController::edit
 * @see app/Http/Controllers/Vendor/ProfileController.php:16
 * @route '/vendor/profile'
 */
        editForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Vendor\ProfileController::edit
 * @see app/Http/Controllers/Vendor/ProfileController.php:16
 * @route '/vendor/profile'
 */
        editForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    edit.form = editForm
/**
* @see \App\Http\Controllers\Vendor\ProfileController::update
 * @see app/Http/Controllers/Vendor/ProfileController.php:24
 * @route '/vendor/profile'
 */
export const update = (options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(options),
    method: 'patch',
})

update.definition = {
    methods: ["patch"],
    url: '/vendor/profile',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Vendor\ProfileController::update
 * @see app/Http/Controllers/Vendor/ProfileController.php:24
 * @route '/vendor/profile'
 */
update.url = (options?: RouteQueryOptions) => {
    return update.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Vendor\ProfileController::update
 * @see app/Http/Controllers/Vendor/ProfileController.php:24
 * @route '/vendor/profile'
 */
update.patch = (options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Vendor\ProfileController::update
 * @see app/Http/Controllers/Vendor/ProfileController.php:24
 * @route '/vendor/profile'
 */
    const updateForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url({
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Vendor\ProfileController::update
 * @see app/Http/Controllers/Vendor/ProfileController.php:24
 * @route '/vendor/profile'
 */
        updateForm.patch = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
const profile = {
    edit: Object.assign(edit, edit),
update: Object.assign(update, update),
}

export default profile