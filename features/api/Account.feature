@After=Registration
Feature: /api/account

    Background: Client defaults

        Given "application/vnd.ausgaben.v1+json; charset=utf-8" is the Accept header
        Given "application/vnd.ausgaben.v1+json; charset=utf-8" is the Content-Type header
        Given "Bearer {token}" is the Authorization header

    Scenario: POST (create)

        Given this is the request body
        --------------
        "name": "Account"
        --------------
        When I POST to /api/account
        Then the status code should be 201
        And the Location header should exist
        When I follow the redirect
        Then the status code should be 200
        And the Content-Type header should equal "application/vnd.ausgaben.v1+json; charset=utf-8"
        And "$context" should equal "https://github.com/ausgaben/ausgaben-node/wiki/JsonLD#Account"
        And "$id" should exist
        And "name" should equal "Account"
        And I store "$id" as "account"

    Scenario: GET (list)

        When I GET /api/account
        Then the status code should be 200
        And the Content-Type header should equal "application/vnd.ausgaben.v1+json; charset=utf-8"
        And a list of "https://github.com/ausgaben/ausgaben-node/wiki/JsonLD#Account" with 1 of 1 item should be returned
        And "name" of the 1st item should equal "Account"
