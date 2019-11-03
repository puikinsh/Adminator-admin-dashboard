module Pages.Dashboard exposing (Msg, view)

import Components.Footer as Footer
import Components.Header as Header
import Components.Sidebar as Sidebar
import Html
    exposing
        ( Html
        , a
        , button
        , canvas
        , div
        , footer
        , h3
        , h5
        , h6
        , i
        , img
        , input
        , label
        , li
        , main_
        , p
        , small
        , span
        , sup
        , table
        , tbody
        , td
        , text
        , th
        , thead
        , tr
        , ul
        )
import Html.Attributes
    exposing
        ( alt
        , attribute
        , class
        , for
        , height
        , href
        , id
        , name
        , placeholder
        , src
        , style
        , target
        , title
        , type_
        , width
        )


type Msg
    = NoOp


view : Html Msg
view =
    div [] [ text "Ready for content" ]
