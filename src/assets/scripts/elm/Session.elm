module Session exposing (User)


type alias User =
    { email : String
    , photoUrl : String
    , orgId : Maybe String
    , accessToken : String
    }
