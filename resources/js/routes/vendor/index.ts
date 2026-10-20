import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
import onboardingC947a0 from './onboarding'
import profile from './profile'
import orders from './orders'
import reviews from './reviews'
import services from './services'
import availability from './availability'
/**
* @see \App\Http\Controllers\Vendor\OnboardingController::onboarding
 * @see app/Http/Controllers/Vendor/OnboardingController.php:15
 * @route '/vendor/onboarding'
 */
export const onboarding = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: onboarding.url(options),
    method: 'get',
})

onboarding.definition = {
    methods: ["get","head"],
    url: '/vendor/onboarding',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Vendor\OnboardingController::onboarding
 * @see app/Http/Controllers/Vendor/OnboardingController.php:15
 * @route '/vendor/onboarding'
 */
onboarding.url = (options?: RouteQueryOptions) => {
    return onboarding.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Vendor\OnboardingController::onboarding
 * @see app/Http/Controllers/Vendor/OnboardingController.php:15
 * @route '/vendor/onboarding'
 */
onboarding.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: onboarding.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Vendor\OnboardingController::onboarding
 * @see app/Http/Controllers/Vendor/OnboardingController.php:15
 * @route '/vendor/onboarding'
 */
onboarding.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: onboarding.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Vendor\OnboardingController::onboarding
 * @see app/Http/Controllers/Vendor/OnboardingController.php:15
 * @route '/vendor/onboarding'
 */
    const onboardingForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: onboarding.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Vendor\OnboardingController::onboarding
 * @see app/Http/Controllers/Vendor/OnboardingController.php:15
 * @route '/vendor/onboarding'
 */
        onboardingForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: onboarding.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Vendor\OnboardingController::onboarding
 * @see app/Http/Controllers/Vendor/OnboardingController.php:15
 * @route '/vendor/onboarding'
 */
        onboardingForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: onboarding.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    onboarding.form = onboardingForm
/**
* @see \App\Http\Controllers\Vendor\DashboardController::__invoke
 * @see app/Http/Controllers/Vendor/DashboardController.php:15
 * @route '/vendor/dashboard'
 */
export const dashboard = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})

dashboard.definition = {
    methods: ["get","head"],
    url: '/vendor/dashboard',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Vendor\DashboardController::__invoke
 * @see app/Http/Controllers/Vendor/DashboardController.php:15
 * @route '/vendor/dashboard'
 */
dashboard.url = (options?: RouteQueryOptions) => {
    return dashboard.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Vendor\DashboardController::__invoke
 * @see app/Http/Controllers/Vendor/DashboardController.php:15
 * @route '/vendor/dashboard'
 */
dashboard.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Vendor\DashboardController::__invoke
 * @see app/Http/Controllers/Vendor/DashboardController.php:15
 * @route '/vendor/dashboard'
 */
dashboard.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: dashboard.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Vendor\DashboardController::__invoke
 * @see app/Http/Controllers/Vendor/DashboardController.php:15
 * @route '/vendor/dashboard'
 */
    const dashboardForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: dashboard.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Vendor\DashboardController::__invoke
 * @see app/Http/Controllers/Vendor/DashboardController.php:15
 * @route '/vendor/dashboard'
 */
        dashboardForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: dashboard.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Vendor\DashboardController::__invoke
 * @see app/Http/Controllers/Vendor/DashboardController.php:15
 * @route '/vendor/dashboard'
 */
        dashboardForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: dashboard.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    dashboard.form = dashboardForm
const vendor = {
    onboarding: Object.assign(onboarding, onboardingC947a0),
dashboard: Object.assign(dashboard, dashboard),
profile: Object.assign(profile, profile),
orders: Object.assign(orders, orders),
reviews: Object.assign(reviews, reviews),
services: Object.assign(services, services),
availability: Object.assign(availability, availability),
}

export default vendor