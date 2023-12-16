"""
This file is for constants that can be used across multiple files
"""

# ANSI color codes
GREEN = '\033[92m'
END = '\033[0m'

# Define cuisine tags
all_cuisine_tags = [
    'angolan', 'argentine', 'australian', 'austrian', 'belgian', 'brazilian', 'cambodian', 'canadian',
    'chilean', 'chinese', 'colombian', 'costa-rican', 'cuban', 'czech', 'danish', 'ecuadorean', 'egyptian',
    'english', 'ethiopian', 'filipino', 'finnish', 'french', 'georgian', 'german', 'greek', 'guatemalan',
    'hawaiian', 'hungarian', 'indian', 'indonesian', 'iranian-persian', 'iraqi', 'irish', 'italian', 'japanese',
    'korean', 'lebanese', 'libyan', 'malaysian', 'mexican', 'mongolian', 'moroccan', 'nepalese', 'nigerian',
    'norwegian', 'pakistani', 'palestinian', 'peruvian', 'polish', 'portuguese', 'puerto-rican', 'russian',
    'scottish', 'south-african', 'spanish', 'swedish', 'swiss', 'thai', 'turkish', 'vietnamese', 'welsh',
    'british-columbian', 'european', 'middle-eastern', 'pacific-northwest', 'quebec', 'scandinavian',
    'southern-united-states', 'southwestern-united-states', 'polynesian', 'south-american',
    'african', 'american', 'asian', 'european', 'north-american'
]

cuisine_country_map = {
    'angolan': 'Angola',
    'argentine': 'Argentina',
    'australian': 'Australia',
    'austrian': 'Austria',
    'belgian': 'Belgium',
    'brazilian': 'Brazil',
    'cambodian': 'Cambodia',
    'canadian': 'Canada',
    'chilean': 'Chile',
    'chinese': 'China',
    'colombian': 'Colombia',
    'costa-rican': 'Costa Rica',
    'cuban': 'Cuba',
    'czech': 'Czech Republic',
    'danish': 'Denmark',
    'ecuadorean': 'Ecuador',
    'egyptian': 'Egypt',
    'english': 'United Kingdom',  # Alternatively, 'England'
    'ethiopian': 'Ethiopia',
    'filipino': 'Philippines',
    'finnish': 'Finland',
    'french': 'France',
    'georgian': 'Georgia',
    'german': 'Germany',
    'greek': 'Greece',
    'guatemalan': 'Guatemala',
    'hawaiian': 'United States of America',  # Hawaii is a state of the USA
    'hungarian': 'Hungary',
    'indian': 'India',
    'indonesian': 'Indonesia',
    'iranian-persian': 'Iran',
    'iraqi': 'Iraq',
    'irish': 'Ireland',
    'italian': 'Italy',
    'japanese': 'Japan',
    'korean': 'South Korea',  # Assuming South Korea
    'lebanese': 'Lebanon',
    'libyan': 'Libya',
    'malaysian': 'Malaysia',
    'mexican': 'Mexico',
    'mongolian': 'Mongolia',
    'moroccan': 'Morocco',
    'nepalese': 'Nepal',
    'nigerian': 'Nigeria',
    'norwegian': 'Norway',
    'pakistani': 'Pakistan',
    'palestinian': 'Palestine',
    'peruvian': 'Peru',
    'polish': 'Poland',
    'portuguese': 'Portugal',
    'puerto-rican': 'Puerto Rico',
    'russian': 'Russia',
    'scottish': 'United Kingdom',  # Alternatively, 'Scotland'
    'south-african': 'South Africa',
    'spanish': 'Spain',
    'swedish': 'Sweden',
    'swiss': 'Switzerland',
    'thai': 'Thailand',
    'turkish': 'Turkey',
    'vietnamese': 'Vietnam',
    'welsh': 'United Kingdom',  # Alternatively, 'Wales'
    'british-columbian': 'Canada',  # British Columbia is a province of Canada
    'pacific-northwest': 'United States of America',  # This region is in the USA
    'quebec': 'Canada',  # Quebec is a province of Canada
    'southern-united-states': 'United States of America',
    'southwestern-united-states': 'United States of America',
    'american': 'United States of America',
}

cuisine_map_keys = [
    'angolan', 'argentine', 'australian', 'austrian', 'belgian', 'brazilian', 'cambodian', 'canadian', 
    'chilean', 'chinese', 'colombian', 'costa-rican', 'cuban', 'czech', 'danish', 'ecuadorean', 
    'egyptian', 'english', 'ethiopian', 'filipino', 'finnish', 'french', 'georgian', 'german', 'greek', 
    'guatemalan', 'hawaiian', 'hungarian', 'indian', 'indonesian', 'iranian-persian', 'iraqi', 'irish', 
    'italian', 'japanese', 'korean', 'lebanese', 'libyan', 'malaysian', 'mexican', 'mongolian', 
    'moroccan', 'nepalese', 'nigerian', 'norwegian', 'pakistani', 'palestinian', 'peruvian', 'polish', 
    'portuguese', 'puerto-rican', 'russian', 'scottish', 'south-african', 'spanish', 'swedish', 
    'swiss', 'thai', 'turkish', 'vietnamese', 'welsh', 'british-columbian', 'pacific-northwest', 
    'quebec', 'southern-united-states', 'southwestern-united-states', 'american']

# Note: For tags that represent a region or continent (like 'european', 'middle-eastern'), you can either omit these
# or find a representative country, if applicable. Some of these mappings might need to be adjusted or expanded
# based on your specific project requirements.
