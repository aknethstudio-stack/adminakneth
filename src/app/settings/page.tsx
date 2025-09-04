'use client'

import React, { useState, useEffect, JSX } from 'react'
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
        const response = await fetch('/api/settings') // Fetch from API route
        if (!response.ok) {
          const errData = await response.json()
          throw new Error(
            errData.message || 'Nieznany błąd podczas pobierania ustawień.',
          )
        }
        const data = await response.json()

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
          setAdminEmails(settingsMap.allowed_admin_emails || '')
          setColorScheme(settingsMap.color_scheme || 'Default')
          setFontSize(settingsMap.font_size || 'Medium')
          setApiKey(settingsMap.api_key || '••••••••••••••••')
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
    <div className="container mx-auto py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Ustawienia</h1>

      {loading && <p className="text-gray-600 mb-4">Ładowanie ustawień...</p>}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          {error}
        </div>
      )}
      {message && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* General Settings */}
          <div className="p-6 rounded-lg shadow-md bg-white">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Ustawienia Ogólne
            </h2>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="siteName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Nazwa Strony
                </label>
                <input
                  id="siteName"
                  type="text"
                  value={siteName}
                  onChange={(e) => { setSiteName(e.target.value); }}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Opis
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => { setDescription(e.target.value); }}
                  rows={3}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="flex items-center text-gray-700">
                  <input
                    type="checkbox"
                    checked={enableNotifications}
                    onChange={(e) => setEnableNotifications(e.target.checked)}
                    className="mr-2 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <span className="text-sm">Włącz powiadomienia</span>
                </label>
              </div>
            </div>
          </div>

          {/* Security Settings */}
          <div className="p-6 rounded-lg shadow-md bg-white">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Ustawienia Bezpieczeństwa
            </h2>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="sessionTimeout"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Czas wygaśnięcia sesji (minuty)
                </label>
                <input
                  id="sessionTimeout"
                  type="number"
                  value={sessionTimeout}
                  onChange={(e) => setSessionTimeout(Number(e.target.value))}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="flex items-center text-gray-700">
                  <input
                    type="checkbox"
                    checked={requireTwoFactor}
                    onChange={(e) => setRequireTwoFactor(e.target.checked)}
                    className="mr-2 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <span className="text-sm">
                    Wymagaj dwuskładnikowego uwierzytelniania
                  </span>
                </label>
              </div>

              <div>
                <label className="flex items-center text-gray-700">
                  <input
                    type="checkbox"
                    checked={logSecurityEvents}
                    onChange={(e) => setLogSecurityEvents(e.target.checked)}
                    className="mr-2 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <span className="text-sm">
                    Loguj zdarzenia bezpieczeństwa
                  </span>
                </label>
              </div>

              {/* Nowe pole dla adminEmails */}
              <div>
                <label
                  htmlFor="adminEmails"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Dozwolone e-maile administratorów (rozdzielone przecinkami)
                </label>
                <textarea
                  id="adminEmails"
                  value={adminEmails}
                  onChange={(e) => setAdminEmails(e.target.value)}
                  rows={3}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:focus:border-indigo-500 sm:text-sm"
                  placeholder="admin1@example.com, admin2@example.com"
                />
              </div>
            </div>
          </div>

          {/* Theme Settings */}
          <div className="p-6 rounded-lg shadow-md bg-white">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Ustawienia Motywu
            </h2>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="colorScheme"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Schemat kolorów
                </label>
                <select
                  id="colorScheme"
                  value={colorScheme}
                  onChange={(e) => setColorScheme(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option>Default</option>
                  <option>Dark Mode</option>
                  <option>High Contrast</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="fontSize"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Rozmiar czcionki
                </label>
                <select
                  id="fontSize"
                  value={fontSize}
                  onChange={(e) => setFontSize(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option>Small</option>
                  <option>Medium</option>
                  <option>Large</option>
                </select>
              </div>
            </div>
          </div>

          {/* API Settings */}
          <div className="p-6 rounded-lg shadow-md bg-white">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Ustawienia API
            </h2>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="apiKey"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Klucz API
                </label>
                <input
                  id="apiKey"
                  type="password"
                  value={apiKey}
                  readOnly // Klucz API nie powinien być edytowalny z poziomu klienta
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="rateLimit"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Limit Rate (żądania/godzinę)
                </label>
                <input
                  id="rateLimit"
                  type="number"
                  value={rateLimit}
                  onChange={(e) => setRateLimit(Number(e.target.value))}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Zapisywanie...' : 'Zapisz Zmiany'}
          </button>
        </div>
      </form>
    </div>
  )
}
