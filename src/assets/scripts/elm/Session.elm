module Session exposing (User, anonUser)


type alias User =
    { name : String
    , email : String
    , photoUrl : String
    , orgId : Maybe String
    , accessToken : String
    }


anonUser : User
anonUser =
    { name = "Anon"
    , email = "nobody@nowhere.com"
    , photoUrl = ""
    , orgId = Just ""
    , accessToken = ""
    }
