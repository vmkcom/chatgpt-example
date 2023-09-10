const teamsFunc = {
  name: 'get_teams', 
  description: 'Get team details and venue', 
  parameters: {
    type: 'object', 
    properties: {
      id: { type: "integer", description: "The id of the team" },
      name: { type: 'string', description: 'The name of the team' },
      league: { type: 'integer', description: 'The id of the league' },
      season: { type: 'integer', description: 'The season of the league' },
      country: { type: 'string', description: 'The country name of the team' },
      code: { type: 'string', description: 'The code of the team' },
      venue: { type: 'string', description: 'The id of the venue' },
      search: { type: 'string', description: 'The name or the country name of the team' }
    }, 
  }
}

const headToHeadFixturesFunc = {
  name: 'get_head_to_head_fixtures',
  description: 'Get heads to heads between two teams. If called without date it returns the last matches',
  parameters: {
    type: 'object',
    properties: {
      team1: { type: 'integer', description: 'The id of the first team' },
      team2: { type: 'integer', description: 'The id of the second team'},
      date: { type: 'string', description: 'Head to heads at the specific date' },  
      from: { type: 'string', description: 'fixtures starting from date in format YYYY-MM-DD' },
      to: { type: 'string', description: 'fixtures up to date in format YYYY-MM-DD' },
      league: { type: 'integer', description: 'The id of the league' },
      venue: { type: 'integer', description: 'The id of the venue' },
      season: { type: 'integer', description: 'The season of the league' }
    }
  }
}

export const functions = [teamsFunc, headToHeadFixturesFunc] 