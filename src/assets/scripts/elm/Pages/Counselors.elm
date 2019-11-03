module Pages.Counselors exposing (Model, Msg, init, update, view)

import Debug exposing (log)
import Form.Decoder as Decoder exposing (Decoder)
import Html
    exposing
        ( Html
        , a
        , br
        , button
        , div
        , fieldset
        , form
        , h1
        , input
        , label
        , legend
        , p
        , span
        , text
        )
import Html.Attributes
    exposing
        ( action
        , class
        , for
        , href
        , method
        , name
        , placeholder
        , type_
        , value
        )
import Html.Events exposing (onClick, onInput, onSubmit)
import Http
import Json.Encode as E



-- MODEL


type alias Model =
    { form : NewCounselorForm, counselor : Maybe NewCounselor }


type alias NewCounselorForm =
    { firstName : String
    , lastName : String
    , email : String
    }


type Msg
    = NewCounselorSubmitted (Result Http.Error ())
    | NewCounselorFormSubmitted
    | EmailCharEntered String
    | FirstNameCharEntered String
    | LastNameCharEntered String


type alias NewCounselor =
    { firstName : String
    , lastName : String
    , email : String
    }



-- UPDATE & INIT


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        NewCounselorSubmitted _ ->
            ( model, Cmd.none )

        NewCounselorFormSubmitted ->
            let
                ( newCounselor, _ ) =
                    case Decoder.run form model.form of
                        Ok newCounselor_ ->
                            ( Just newCounselor_, Nothing )

                        Err _ ->
                            ( Nothing, Nothing )
            in
            ( { model | counselor = newCounselor }, Cmd.none )

        FirstNameCharEntered char ->
            let
                cForm : NewCounselorForm
                cForm =
                    model.form

                form_ : NewCounselorForm
                form_ =
                    { cForm | firstName = String.trim char }
            in
            ( { model | form = form_ }, Cmd.none )

        LastNameCharEntered char ->
            let
                cForm : NewCounselorForm
                cForm =
                    model.form

                form_ : NewCounselorForm
                form_ =
                    { cForm | lastName = String.trim char }
            in
            ( { model | form = form_ }, Cmd.none )

        EmailCharEntered char ->
            let
                cForm : NewCounselorForm
                cForm =
                    model.form

                form_ : NewCounselorForm
                form_ =
                    { cForm | email = String.trim char }
            in
            ( { model | form = form_ }, Cmd.none )


init : Model
init =
    { form = NewCounselorForm "" "" "", counselor = Nothing }



-- VIEW


view : Html Msg
view =
    div
        []
        [ h1 [] [ text "Counselors" ]
        , a [ href "/" ] [ text "Dashboard" ]
        , br [] []
        , Html.form
            [ class "pure-form pure-form-aligned"
            , onSubmit NewCounselorFormSubmitted
            ]
            [ legend
                []
                [ text "Invite a Counselor"
                , fieldset []
                    [ div
                        [ class "pure-control-group" ]
                        [ label [ for "first_name" ] [ text "First Name" ]
                        , input
                            [ type_ "text", placeholder "First Name", name "first_name", onInput FirstNameCharEntered ]
                            []
                        ]
                    , div
                        [ class "pure-control-group" ]
                        [ label [ for "last_name" ] [ text "Last Name" ]
                        , input
                            [ type_ "text", name "last_name", placeholder "Last Name", onInput LastNameCharEntered ]
                            []
                        ]
                    , div
                        [ class "pure-control-group" ]
                        [ label [ for "email" ] [ text "Email" ]
                        , input
                            [ type_ "text", name "email", placeholder "Email", onInput EmailCharEntered ]
                            []
                        , div
                            [ class "pure-controls" ]
                            [ input
                                [ type_ "submit"
                                , class "pure-button pure-button-primary"
                                , value "Submit"
                                ]
                                []
                            ]
                        ]
                    ]
                ]
            ]
        ]



-- Form Handling


type FormError
    = FirstNameRequired
    | LastNameRequired
    | EmailRequired
    | InvalidEmail


firstName : Decoder String FormError String
firstName =
    Decoder.identity
        |> Decoder.assert (Decoder.minLength FirstNameRequired 1)


lastName : Decoder String FormError String
lastName =
    Decoder.identity
        |> Decoder.assert (Decoder.minLength LastNameRequired 1)


email : Decoder String FormError String
email =
    Decoder.identity
        |> Decoder.assert (Decoder.minLength EmailRequired 1)


firstName_ : Decoder NewCounselorForm FormError String
firstName_ =
    Decoder.lift .firstName firstName


lastName_ : Decoder NewCounselorForm FormError String
lastName_ =
    Decoder.lift .lastName lastName


email_ : Decoder NewCounselorForm FormError String
email_ =
    Decoder.lift .email email


form : Decoder NewCounselorForm FormError NewCounselor
form =
    Decoder.top NewCounselor
        |> Decoder.field firstName_
        |> Decoder.field lastName_
        |> Decoder.field email_


toNewCounselor : NewCounselorForm -> Result (List FormError) NewCounselor
toNewCounselor theForm =
    Ok <| NewCounselor "" "" ""



-- API


encodeNewCounselor : NewCounselor -> E.Value
encodeNewCounselor counselor =
    E.object
        [ ( "firstName", E.string counselor.firstName )
        , ( "lastName", E.string counselor.lastName )
        , ( "email", E.string counselor.email )
        ]


submitNewCounselor : NewCounselor -> Cmd Msg
submitNewCounselor counselor =
    Http.post
        { url = "/counselors"
        , body = Http.jsonBody (encodeNewCounselor counselor)
        , expect = Http.expectWhatever NewCounselorSubmitted
        }
