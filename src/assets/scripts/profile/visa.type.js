const visas = [
    {
        id: 0,
        type: "Visitor visa",
        subclass: "601",
        name: "Electronic Travel Authority (subclass 601)"
    },
    {
        id: 1,
        type: "Visitor visa",
        subclass: "651",
        name: "eVisitor (subclass 651)"
    },
    {
        id: 2,
        type: "Visitor visa",
        subclass: "771",
        name: "Transit visa (subclass 771)"
    },
    {
        id: 3,
        type: "Visitor visa",
        subclass: "600",
        name: "Visitor (subclass 600)"
    },
    {
        id: 4,
        type: "Visitor visa",
        subclass: "417-462",
        name: "Work and Holiday visa (subclass 417 462)"
    },
    {
        id: 5,
        type: "Studying and training visas",
        subclass: "500",
        name: "Student visa (subclass 500)"
    },
    {
        id: 6,
        type: "Studying and training visas",
        subclass: "590",
        name: "Student Guardian visa (subclass 590)"
    },
    {
        id: 7,
        type: "Studying and training visas",
        subclass: "407",
        name: "Training visa (subclass 407)"
    },
    {
        id: 8,
        type: "Family and partner visas",
        subclass: "102",
        name: "Adoption visa (subclass 102)"
    },
    {
        id: 9,
        type: "Family and partner visas",
        subclass: "114-838",
        name: "Aged Dependent Relative visa (subclass 114 838)"
    },
    {
        id: 10,
        type: "Family and partner visas",
        subclass: "804",
        name: "Aged Parent visa (subclass 804)"
    },
    {
        id: 11,
        type: "Family and partner visas",
        subclass: "116-836",
        name: "Carer visa (subclass 116 836)"
    },
    {
        id: 12,
        type: "Family and partner visas",
        subclass: "101-802",
        name: "Child visa (subclass 101 802)"
    },
    {
        id: 12,
        type: "Family and partner visas",
        subclass: "864-884",
        name: "Contributory Aged Parent visa (subclass 864 884)"
    },
    {
        id: 13,
        type: "Family and partner visas",
        subclass: "143-173",
        name: "Contributory Parent visa (subclass 143 173)"
    },
    {
        id: 14,
        type: "Family and partner visas",
        subclass: "445",
        name: "Dependent Child visa (subclass 445)"
    },
    {
        id: 15,
        type: "Family and partner visas",
        subclass: "461",
        name: "New Zealand Citizen Family Relationship (temporary) visa (subclass 461)"
    },
    {
        id: 16,
        type: "Family and partner visas",
        subclass: "117-837",
        name: "Orphan Relative (subclass 117 837)"
    },
    {
        id: 17,
        type: "Family and partner visas",
        subclass: "103",
        name: "Parent visa (subclass 103)"
    },
    {
        id: 18,
        type: "Family and partner visas",
        subclass: "100-309",
        name: "Partner (Provisional and Migrant) visa (subclass 309 100)"
    },
    {
        id: 19,
        type: "Family and partner visas",
        subclass: "801-820",
        name: "Partner visa (subclass 820 801)"
    },
    {
        id: 20,
        type: "Family and partner visas",
        subclass: "300",
        name: "Prospective Marriage visa (subclass 300)"
    },
    {
        id: 21,
        type: "Family and partner visas",
        subclass: "115-835",
        name: "Remaining Relative visa (subclass 115 835)"
    },
    {
        id: 22,
        type: "Working and skilled visas",
        subclass: "188-888",
        name: "Business Innovation and Investment visa (subclass 188 888)"
    },
    {
        id: 23,
        type: "Working and skilled visas",
        subclass: "890",
        name: "Business Owner (subclass 890)"
    },
    {
        id: 24,
        type: "Working and skilled visas",
        subclass: "132",
        name: "Business Talent visa (subclass 132)"
    },
    {
        id: 25,
        type: "Working and skilled visas",
        subclass: "124-858",
        name: "Distinguished Talent visa (subclass 124 858)"
    },
    {
        id: 26,
        type: "Working and skilled visas",
        subclass: "186",
        name: "Employer Nomination Scheme (subclass 186)"
    },
    {
        id: 27,
        type: "Working and skilled visas",
        subclass: "891",
        name: "Investor visa (subclass 891)"
    },
    {
        id: 28,
        type: "Working and skilled visas",
        subclass: "187",
        name: "Regional Sponsor Migration Scheme (subclass 187)"
    },
    {
        id: 29,
        type: "Working and skilled visas",
        subclass: "189",
        name: "Skilled Independent visa (subclass 189)"
    },
    {
        id: 30,
        type: "Working and skilled visas",
        subclass: "190",
        name: "Skilled Nominated visa (subclass 190)"
    },
    {
        id: 30,
        type: "Working and skilled visas",
        subclass: "476",
        name: "Skilled-Recognised Graduate visa (subclass 476)"
    },
    {
        id: 31,
        type: "Working and skilled visas",
        subclass: "489-887",
        name: "Skilled Regional visa (subclass 489 887)"
    },
    {
        id: 32,
        type: "Working and skilled visas",
        subclass: "892",
        name: "State or Territory Sponsored Business Owner visa (subclass 892)"
    },
    {
        id: 33,
        type: "Working and skilled visas",
        subclass: "893",
        name: "State or Territory Sponsored Investor visa (subclass 893)"
    },
    {
        id: 34,
        type: "Working and skilled visas",
        subclass: "408",
        name: "Temporary Activity visa (subclass 408)"
    },
    {
        id: 35,
        type: "Working and skilled visas",
        subclass: "485",
        name: "Temporary Graduate visa (subclass 485)"
    },
    {
        id: 36,
        type: "Working and skilled visas",
        subclass: "400-403",
        name: "Temporary Work visa (subclass 400 403)"
    },
    {
        id: 37,
        type: "Working and skilled visas",
        subclass: "482",
        name: "Temporary Skill Shortage visa (subclass 482)"
    },
]

export default visas;
 /**       

    Refugee and humanitarian visas
    Global Special Humanitarian (subclass 202) 
    Protection visa (subclass 866) 
    Refugee visas (subclass 200, 201, 203 and 204) 
    Temporary Protection visa (subclass 785) 
    Safe Haven Enterprise visa (subclass 790) 

    Other visas
    Bridging visa A – BVA - (subclass 010)
    Bridging visa B – BVB – (subclass 020)
    Bridging visa C – BVC – (subclass 030)
    Bridging visa E – BVE – (subclass 050 and 051)
    Crew Travel Authority visa (subclass 942)
    Former Resident visa (subclass 151)
    Maritime Crew visa (subclass 988)
    Medical Treatment visa (subclass 602)
    Resident Return visa (subclass 155 157)
    Special Category visa (subclass 444)
    
    Special Purpose visa 
    Retirement visa (subclass 410)
    Investor Retirement visa (subclass 405)
    Confirmatory (Residence) visa (subclass 808) 
    
    Repealed visas
    Business (Short Stay) visa (subclass 456)
    Business Skills (Provisional) visa (subclass 160 and 165)
    Domestic Worker (Temporary) Diplomatic and Consular visa (subclass 426)
    Domestic Worker (Temporary) Executive visa (subclass 427)
    Electronic Travel Authority (Business Entrant) visa (subclass 956 and 977)
    Electronic Travel Authority (Visitor) visa (subclass 976)
    Employer Nomination Scheme (subclass 121 and 856)
    Established Business in Australia visa (subclass 845)
    Exchange visa (subclass 411)
    Foreign Government Agency (subclass 415)
    Government Agreement visa (subclass 406)
    Labour Agreement visa (subclass 120)
    Labour Agreement visa (subclass 855)
    Media and Film Staff visa (subclass 423)
    Medical Practitioner visa (subclass 422)
    Medical Treatment (Short Stay) visa (subclass 675)
    Medical Treatment Long Stay visa (subclass 685)
    Regional Sponsor Migration Scheme (subclass 119 and 857)
    Religious Worker visa (subclass 428)
    Skilled Designated Area Sponsored visa (subclass 496)
    Skilled Independent Regional (Provisional) visa (subclass 495)
    Skilled Independent visa (subclass 175)
    Skilled Independent visa (subclass 885)
    Skilled Regional Sponsored visa (subclass 475)
    Skilled Regional Sponsored (subclass 487)
    Skilled Sponsored visa (subclass 176)
    Special Program visa (subclass 416)
    Sponsored visa (subclass 886)
    Sport visa (subclass 421)
    Superyacht Crew visa (subclass 488)
    State or Territory Sponsored Regional Established Business in Australia visa (subclass 846)
    Temporary Work (Entertainment) visa (subclass 420)
    Temporary Work (Skilled) visa (subclass 457)
    Tourist visa (subclass 676)
    Temporary Work (long Stay Activity) visa (subclass 401)
    Training and Research visa (subclass 402)
    Visiting Academic visa (subclass 419)
    Foreign Affairs or Defence sector visa (subclass 576)
    Higher Education Sector visa (subclass 573)
    Independent ELICOS Sector visa (subclass 570)
    Non Award Sector visa (subclass 575)
    Postgraduate Research Sector visa (subclass 574)
    School Sector visa (subclass 571)
    Student Guardian visa (subclass 580)
    Vocational Education and Training Sector visa (Subclass 572)
] */