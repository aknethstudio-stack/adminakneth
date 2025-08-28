'use client'

import React, { useState, useEffect, JSX } from 'react'
import { createClient } from '@supabase/supabase-js'

// Inicjalizacja klienta Supabase dla interakcji z bazą danych
// Używamy zmiennych publicznych, ale pamiętaj, że klucz service_role jest potrzebny po stronie serwera!
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default function Settings(): JSX.Element {
  // Stany dla każdego pola ustawień
  const [siteName, setSiteName] = useState<string>('Admin Panel')
  const [description, setDescription] = useState<string>(
    'Panel administracyjny AKNETH Studio',
  )
  const [enableNotifications, setEnableNotifications] = useState<boolean>(true)
  const [sessionTimeout, setSessionTimeout] = useState<number>(30)
  const [requireTwoFactor, setRequireTwoFactor] = useState<boolean>(false)
  const [logSecurityEvents, setLogSecurityEvents] = useState<boolean>(false)
  const [adminEmails, setAdminEmails] = useState<string>('') // Nowe pole dla adminEmails
  const [colorScheme, setColorScheme] = useState<string>('Default')
  const [fontSize, setFontSize] = useState<string>('Medium')
  const [apiKey, setApiKey] = useState<string>('••••••••••••••••') // Nie edytujemy, ale zachowujemy stan
  const [rateLimit, setRateLimit] = useState<number>(1000)
  const [loading, setLoading] = useState<boolean>(true)
  const [message, setMessage] = useState<string>('')
  const [error, setError] = useState<string>('')

  useEffect(() => {
    // Funkcja do pobierania ustawień z bazy danych
    const fetchSettings = async (): Promise<void> => {
      setLoading(true)
      try {
        const { data, error } = await supabase
          .from('app_settings')
          .select('name, value')

        if (error) throw error

        if (data) {
          const settingsMap = data.reduce(
            (
              acc: Record<string, string>,
              item: { name: string; value: string },
            ) => {
              acc[item.name] = item.value
              return acc
            },
            {} as Record<string, string>,
          )

          setSiteName(settingsMap.site_name || 'Admin Panel')
          setDescription(
            settingsMap.description || 'Panel administracyjny AKNETH Studio',
          )
          setEnableNotifications(settingsMap.enable_notifications === 'true')
          setSessionTimeout(parseInt(settingsMap.session_timeout || '30'))
          setRequireTwoFactor(settingsMap.require_two_factor === 'true')
          setLogSecurityEvents(settingsMap.log_security_events === 'true')
          setAdminEmails(settingsMap.allowed_admin_emails || '') // Ustawienie pobranych adminEmails
          setColorScheme(settingsMap.color_scheme || 'Default')
          setFontSize(settingsMap.font_size || 'Medium')
          setApiKey(settingsMap.api_key || '••••••••••••••••') // API Key może być tylko wyświetlany, nie edytowany
          setRateLimit(parseInt(settingsMap.rate_limit || '1000'))
        }
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : String(err)
        console.error('Błąd podczas pobierania ustawień:', errorMessage)
        setError('Błąd podczas ładowania ustawień: ' + errorMessage)
      } finally {
        setLoading(false)
      }
    }

    fetchSettings()
  }, [])

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    setError('')

    try {
      const settingsToSave = [
        { name: 'site_name', value: siteName },
        { name: 'description', value: description },
        { name: 'enable_notifications', value: String(enableNotifications) },
        { name: 'session_timeout', value: String(sessionTimeout) },
        { name: 'require_two_factor', value: String(requireTwoFactor) },
        { name: 'log_security_events', value: String(logSecurityEvents) },
        { name: 'allowed_admin_emails', value: adminEmails }, // Zapis adminEmails
        { name: 'color_scheme', value: colorScheme },
        { name: 'font_size', value: fontSize },
        { name: 'api_key', value: apiKey },
        { name: 'rate_limit', value: String(rateLimit) },
      ]

      // Wysyłamy dane do nowego endpointu API
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settingsToSave),
      })

      if (!response.ok) {
        const errData = await response.json()
        throw new Error(
          errData.message || 'Nieznany błąd podczas zapisywania ustawień.',
        )
      }

      setMessage('Ustawienia zapisane pomyślnie!')
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err)
      console.error('Błąd podczas zapisywania ustawień:', errorMessage)
      setError('Błąd podczas zapisywania ustawień: ' + errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8">
      <h1
        className="text-3xl font-bold mb-6"
        style={{ color: 'var(--color-body-text)' }}
      >
        Ustawienia
      </h1>

      {loading && (
        <p style={{ color: 'var(--color-body-text)' }}>Ładowanie ustawień...</p>
      )}
      {error && <p style={{ color: '#ef4444' }}>{error}</p>}
      {message && <p style={{ color: '#10b981' }}>{message}</p>}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* General Settings */}
          <div
            className="p-6 rounded-lg shadow-md"
            style={{ backgroundColor: 'var(--color-light)' }}
          >
            <h2
              className="text-xl font-semibold mb-4"
              style={{ color: 'var(--color-body-text)' }}
            >
              Ustawienia Ogólne
            </h2>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="siteName"
                  className="block text-sm font-medium mb-2"
                  style={{ color: 'var(--color-body-text)' }}
                >
                  Nazwa Strony
                </label>
                <input
                  id="siteName"
                  type="text"
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  style={{
                    borderColor: 'var(--color-secondary)',
                    backgroundColor: 'var(--color-body-background)',
                  }}
                />
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium mb-2"
                  style={{ color: 'var(--color-body-text)' }}
                >
                  Opis
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border rounded-md"
                  style={{
                    borderColor: 'var(--color-secondary)',
                    backgroundColor: 'var(--color-body-background)',
                  }}
                />
              </div>

              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={enableNotifications}
                    onChange={(e) => setEnableNotifications(e.target.checked)}
                    className="mr-2"
                    style={{ accentColor: 'var(--color-primary)' }}
                  />
                  <span
                    className="text-sm"
                    style={{ color: 'var(--color-body-text)' }}
                  >
                    Włącz powiadomienia
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Security Settings */}
          <div
            className="p-6 rounded-lg shadow-md"
            style={{ backgroundColor: 'var(--color-light)' }}
          >
            <h2
              className="text-xl font-semibold mb-4"
              style={{ color: 'var(--color-body-text)' }}
            >
              Ustawienia Bezpieczeństwa
            </h2>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="sessionTimeout"
                  className="block text-sm font-medium mb-2"
                  style={{ color: 'var(--color-body-text)' }}
                >
                  Czas wygaśnięcia sesji (minuty)
                </label>
                <input
                  id="sessionTimeout"
                  type="number"
                  value={sessionTimeout}
                  onChange={(e) => setSessionTimeout(Number(e.target.value))}
                  className="w-full px-3 py-2 border rounded-md"
                  style={{
                    borderColor: 'var(--color-secondary)',
                    backgroundColor: 'var(--color-body-background)',
                  }}
                />
              </div>

              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={requireTwoFactor}
                    onChange={(e) => setRequireTwoFactor(e.target.checked)}
                    className="mr-2"
                    style={{ accentColor: 'var(--color-primary)' }}
                  />
                  <span
                    className="text-sm"
                    style={{ color: 'var(--color-body-text)' }}
                  >
                    Wymagaj dwuskładnikowego uwierzytelniania
                  </span>
                </label>
              </div>

              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={logSecurityEvents}
                    onChange={(e) => setLogSecurityEvents(e.target.checked)}
                    className="mr-2"
                    style={{ accentColor: 'var(--color-primary)' }}
                  />
                  <span
                    className="text-sm"
                    style={{ color: 'var(--color-body-text)' }}
                  >
                    Loguj zdarzenia bezpieczeństwa
                  </span>
                </label>
              </div>

              {/* Nowe pole dla adminEmails */}
              <div>
                <label
                  htmlFor="adminEmails"
                  className="block text-sm font-medium mb-2"
                  style={{ color: 'var(--color-body-text)' }}
                >
                  Dozwolone e-maile administratorów (rozdzielone przecinkami)
                </label>
                <textarea
                  id="adminEmails"
                  value={adminEmails}
                  onChange={(e) => setAdminEmails(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border rounded-md"
                  style={{
                    borderColor: 'var(--color-secondary)',
                    backgroundColor: 'var(--color-body-background)',
                  }}
                  placeholder="admin1@example.com, admin2@example.com"
                />
              </div>
            </div>
          </div>

          {/* Theme Settings */}
          <div
            className="p-6 rounded-lg shadow-md"
            style={{ backgroundColor: 'var(--color-light)' }}
          >
            <h2
              className="text-xl font-semibold mb-4"
              style={{ color: 'var(--color-body-text)' }}
            >
              Ustawienia Motywu
            </h2>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="colorScheme"
                  className="block text-sm font-medium mb-2"
                  style={{ color: 'var(--color-body-text)' }}
                >
                  Schemat kolorów
                </label>
                <select
                  id="colorScheme"
                  value={colorScheme}
                  onChange={(e) => setColorScheme(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  style={{
                    borderColor: 'var(--color-secondary)',
                    backgroundColor: 'var(--color-body-background)',
                  }}
                >
                  <option>Default</option>
                  <option>Dark Mode</option>
                  <option>High Contrast</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="fontSize"
                  className="block text-sm font-medium mb-2"
                  style={{ color: 'var(--color-body-text)' }}
                >
                  Rozmiar czcionki
                </label>
                <select
                  id="fontSize"
                  value={fontSize}
                  onChange={(e) => setFontSize(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  style={{
                    borderColor: 'var(--color-secondary)',
                    backgroundColor: 'var(--color-body-background)',
                  }}
                >
                  <option>Small</option>
                  <option>Medium</option>
                  <option>Large</option>
                </select>
              </div>
            </div>
          </div>

          {/* API Settings */}
          <div
            className="p-6 rounded-lg shadow-md"
            style={{ backgroundColor: 'var(--color-light)' }}
          >
            <h2
              className="text-xl font-semibold mb-4"
              style={{ color: 'var(--color-body-text)' }}
            >
              Ustawienia API
            </h2>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="apiKey"
                  className="block text-sm font-medium mb-2"
                  style={{ color: 'var(--color-body-text)' }}
                >
                  Klucz API
                </label>
                <input
                  id="apiKey"
                  type="password"
                  value={apiKey}
                  readOnly // Klucz API nie powinien być edytowalny z poziomu klienta
                  className="w-full px-3 py-2 border rounded-md"
                  style={{
                    borderColor: 'var(--color-secondary)',
                    backgroundColor: 'var(--color-body-background)',
                  }}
                />
              </div>

              <div>
                <label
                  htmlFor="rateLimit"
                  className="block text-sm font-medium mb-2"
                  style={{ color: 'var(--color-body-text)' }}
                >
                  Limit Rate (żądania/godzinę)
                </label>
                <input
                  id="rateLimit"
                  type="number"
                  value={rateLimit}
                  onChange={(e) => setRateLimit(Number(e.target.value))}
                  className="w-full px-3 py-2 border rounded-md"
                  style={{
                    borderColor: 'var(--color-secondary)',
                    backgroundColor: 'var(--color-body-background)',
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-8 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded font-medium transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: 'var(--color-primary)',
              color: 'var(--color-dark)',
              borderRadius: 'var(--border-radius-nav-pills)',
            }}
          >
            {loading ? 'Zapisywanie...' : 'Zapisz Zmiany'}
          </button>
        </div>
      </form>
    </div>
  )
}
