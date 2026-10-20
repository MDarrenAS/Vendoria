import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Vendor\OnboardingController::show
 * @see app/Http/Controllers/Vendor/OnboardingController.php:15
 * @route '/vendor/onboarding'
 */
export const show = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/vendor/onboarding',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Vendor\OnboardingController::show
 * @see app/Http/Controllers/Vendor/OnboardingController.php:15
 * @route '/vendor/onboarding'
 */
show.url = (options?: RouteQueryOptions) => {
    return show.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Vendor\OnboardingController::show
 * @see app/Http/Controllers/Vendor/OnboardingController.php:15
 * @route '/vendor/onboarding'
 */
show.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Vendor\OnboardingController::show
 * @see app/Http/Controllers/Vendor/OnboardingController.php:15
 * @route '/vendor/onboarding'
 */
show.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Vendor\OnboardingController::show
 * @see app/Http/Controllers/Vendor/OnboardingController.php:15
 * @route '/vendor/onboarding'
 */
    const showForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Vendor\OnboardingController::show
 * @see app/Http/Controllers/Vendor/OnboardingController.php:15
 * @route '/vendor/onboarding'
 */
        showForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Vendor\OnboardingController::show
 * @see app/Http/Controllers/Vendor/OnboardingController.php:15
 * @route '/vendor/onboarding'
 */
        showForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
/**
* @see \App\Http\Controllers\Vendor\OnboardingController::update
 * @see app/Http/Controllers/Vendor/OnboardingController.php:22
 * @route '/vendor/onboarding'
 */
export const update = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/vendor/onboarding',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Vendor\OnboardingController::update
 * @see app/Http/Controllers/Vendor/OnboardingController.php:22
 * @route '/vendor/onboarding'
 */
update.url = (options?: RouteQueryOptions) => {
    return update.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Vendor\OnboardingController::update
 * @see app/Http/Controllers/Vendor/OnboardingController.php:22
 * @route '/vendor/onboarding'
 */
update.put = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\Vendor\OnboardingController::update
 * @see app/Http/Controllers/Vendor/OnboardingController.php:22
 * @route '/vendor/onboarding'
 */
    const updateForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url({
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Vendor\OnboardingController::update
 * @see app/Http/Controllers/Vendor/OnboardingController.php:22
 * @route '/vendor/onboarding'
 */
        updateForm.put = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
const OnboardingController = { show, update }

export default OnboardingController