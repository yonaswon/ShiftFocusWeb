'use client'
import React, { useEffect, useState } from 'react'
import api from '@/api'
import { jwtDecode } from 'jwt-decode'
import { useRouter } from 'next/navigation'


const Page = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
    const [authError, setAuthError] = useState<boolean | string>(false)
    const router = useRouter()

    const isTokenExpired = (token: string) => {
        const decoded_tokens: any = jwtDecode(token)
        const currentTime = Math.floor(Date.now() / 1000);
        if (decoded_tokens?.exp >= currentTime) {
            return false
        } else {
            return true
        }

    }

    const getTokens = () => {
        try {
            const tokens = localStorage.getItem('tokens')
            if (tokens) {
                return JSON.parse(tokens)
            } else {
                throw 'not found'
            }
        } catch (error) {
            return null
        }
    }

    const refreshTheToken = async (refresh: string) => {
        if (!refresh) return;
        try {
            const result: any = api.post('/auth/jwt/refresh/', {
                refresh: refresh
            })
            localStorage.setItem('tokens', JSON.stringify(result.data))
            mainAuth()
        } catch (error) {
            setAuthError("Can't Refresh Token Please Try Again !")
        }
    }

    const mainAuth = async () => {
        try {
            const tokens = getTokens()
            if (!tokens) {
              router.push('/onboarding')
              return;
            }
            const { access, refresh } = tokens
            if (!access) {
              router.push('/auth')
              return;
            }
            const is_acess_token_expired = isTokenExpired(access)
            if (is_acess_token_expired) {
                if (refresh) {
                    refreshTheToken(refresh)
                } else {
                    router.push('/auth')
                    return
                }
            } else {
                setIsAuthenticated(true)
            }
        } catch (error) {
            setAuthError(true)
        }
    }

    useEffect(() => {
        mainAuth()
    }, [])

    return (
        <>{isAuthenticated == null && <div>
            <h1>AUTHENTICATING .... </h1></div>}
            {isAuthenticated != null && isAuthenticated && <div>

            </div>}
        </>
    )
}

export default Page
