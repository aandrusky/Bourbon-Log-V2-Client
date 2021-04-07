import React, { useContext } from "react"
import { LogContext } from './LogProvider'

export const LogSearch = () => {
  const { setSearchTerms } = useContext(LogContext)

  return (
    <>
      Search logs:
      <input type="text"
        className="input--wide"
        onKeyUp={(event) => setSearchTerms(event.target.value)}
        placeholder="Search for bourbon log... " />
    </>
  )
}