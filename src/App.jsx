import { useState, useCallback } from 'react'
import { teams, groupNames } from './data/teams'
import { fixtures, alias } from './data/fixtures'
import Hero from './components/Hero'
import Tabs from './components/Tabs'
import Rankings from './components/Rankings'
import TeamsGrid from './components/TeamsGrid'
import Groups from './components/Groups'
import Matches from './components/Matches'
import Gaps from './components/Gaps'
import GroupStandings from './components/GroupStandings'
import Bracket from './components/Bracket'
import MLPredictor from './components/MLPredictor'
import SquadPanel from './components/SquadPanel'

const sorted = [...teams].sort((a, b) => b.value - a.value)
const teamByName = Object.fromEntries(teams.map(t => [t.name, t]))
function T(name) { return teamByName[alias[name] || name] }

export default function App() {
  const [activeTab, setActiveTab] = useState('bracket')
  const [squadTeam, setSquadTeam] = useState(null)

  const openSquad = useCallback((name) => setSquadTeam(name), [])
  const closeSquad = useCallback(() => setSquadTeam(null), [])

  const handleTeamLink = useCallback((name) => {
    setActiveTab('teams')
    setSquadTeam(name)
  }, [])

  return (
    <>
      <Hero teams={teams} />
      <Tabs active={activeTab} onSelect={setActiveTab} />
      <div className="container">
        {activeTab === 'bracket' && <Bracket />}
        {activeTab === 'predict' && <MLPredictor />}
        {activeTab === 'standings' && <GroupStandings />}
        {activeTab === 'rankings' && (
          <Rankings sorted={sorted} onTeamLink={handleTeamLink} />
        )}
        {activeTab === 'teams' && (
          <TeamsGrid sorted={sorted} onTeamClick={openSquad} />
        )}
        {activeTab === 'groups' && (
          <Groups teams={teams} groupNames={groupNames} onTeamLink={handleTeamLink} />
        )}
        {activeTab === 'matches' && (
          <Matches fixtures={fixtures} T={T} groupNames={groupNames} />
        )}
        {activeTab === 'matchups' && (
          <Gaps teams={teams} groupNames={groupNames} onTeamLink={handleTeamLink} />
        )}
      </div>
      {squadTeam && (
        <SquadPanel teamName={squadTeam} teams={teams} onClose={closeSquad} />
      )}
    </>
  )
}
