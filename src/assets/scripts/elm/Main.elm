port module Main exposing (Model, Msg(..), init, main, update, view)

import Browser exposing (Document, UrlRequest(..))
import Browser.Navigation as Nav exposing (Key)
import Html exposing (Html, a, br, div, h1, img, text)
import Html.Attributes exposing (class, href, id, src)
import Html.Events exposing (onClick)
import Pages.Counselors as Counselors
import Session exposing (User)
import Url exposing (Url)
import Url.Parser as Parser exposing (Parser, map, oneOf, s, top)



---- MODEL ----


type alias Model =
    { navKey : Key, page : Page, user : Maybe User }


type Page
    = Dashboard
    | Counselors Counselors.Model


init : Maybe User -> Url -> Key -> ( Model, Cmd Msg )
init user url key =
    ( { navKey = key
      , page = whichPage url
      , user = user
      }
    , Cmd.none
    )


routes : Parser (Page -> Page) Page
routes =
    oneOf
        [ map Dashboard top
        , map (Counselors Counselors.init) (s "counselors")
        ]


whichPage : Url -> Page
whichPage url =
    Maybe.withDefault Dashboard (Parser.parse routes url)



---- UPDATE ----


type Msg
    = ClickedLink UrlRequest
    | ChangedUrl Url
    | CounselorsMsg Counselors.Msg
    | Logout
    | NoOp


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case ( msg, model.page ) of
        ( ClickedLink req, _ ) ->
            case req of
                Internal url ->
                    ( model
                    , Nav.pushUrl model.navKey (Url.toString url)
                    )

                External href ->
                    ( model, Nav.load href )

        ( ChangedUrl url, _ ) ->
            ( { model | page = whichPage url }, Cmd.none )

        ( CounselorsMsg cMsg, Counselors cModel ) ->
            let
                ( cModel_, cCmd ) =
                    Counselors.update cMsg cModel
            in
            ( { model
                | page = Counselors cModel_
              }
            , Cmd.map CounselorsMsg cCmd
            )

        ( Logout, _ ) ->
            ( { model | user = Nothing }, logout () )

        _ ->
            ( model, Cmd.none )



---- VIEW ----


view : Model -> Document Msg
view model =
    let
        content =
            case model.page of
                Counselors cModel ->
                    Html.map CounselorsMsg Counselors.view

                Dashboard ->
                    mainHtml
    in
    { title = "InteroCare Admin"
    , body =
        [ div []
            [ img [ src "/ALFBLogo.png" ] []
            , div [ id "firebaseui-auth-container", class "hidden" ] []
            , content
            ]
        ]
    }


mainHtml : Html Msg
mainHtml =
    div
        []
        [ div [ id "firebaseui-auth-container" ] []
        , h1
            []
            [ text "Dashboard" ]
        , a [ href "/counselors" ] [ text "Counselors" ]
        , br [] []
        , a [ href "/", onClick Logout ] [ text "Logout" ]
        ]



---- PROGRAM ----


main : Program (Maybe User) Model Msg
main =
    Browser.application
        { view = view
        , init = init
        , update = update
        , subscriptions = always Sub.none
        , onUrlRequest = ClickedLink
        , onUrlChange = ChangedUrl
        }



-- Ports


port logout : () -> Cmd msg
