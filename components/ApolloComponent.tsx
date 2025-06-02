'use client'
import React, {useEffect, useState} from 'react';
import {ApolloNextAppProvider, InMemoryCache, ApolloClient} from "@apollo/client-integration-nextjs";
import {ApolloLink, DefaultContext, HttpLink, useQuery, gql} from "@apollo/client";

export const ApolloComponent: React.FC = () => {
    const gateway = 'https://graph.dev.we-create.io/graphql'
    const [accessToken, setAccessToken] = useState('InvalidToken')
    useEffect(() => {
        const timeout = setTimeout(() => setAccessToken('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'), 1000);
        return () => void timeout.close()
    }, []);
    console.log("In Apollo Component - access token", accessToken);
    const client = createApolloClient(gateway, accessToken);
    return <ApolloNextAppProvider makeClient={() => {
        console.log('In ApolloNextAppProvider callback')
        return client;
    }}><Inner accessToken={accessToken}></Inner></ApolloNextAppProvider>;
}
const Inner: React.FC<{ accessToken: string }> = ({accessToken}) => {
    const queryResult = useQuery(gql("query { __schema { __typename  }}"), {pollInterval: 4000,});
    return <div>{accessToken + JSON.stringify(queryResult.error)}</div>
}

export const createApolloClient = (gatewayUrl: string, accessToken: string | undefined) => {
    return new ApolloClient({
        link: ApolloLink.from([
            createAuthLink(accessToken),
            new HttpLink({
                uri: gatewayUrl,
                credentials: 'same-origin',
            }),
        ]),
        cache: new InMemoryCache(),
        defaultOptions: {
            watchQuery: {
                fetchPolicy: 'network-only',
                nextFetchPolicy: 'network-only',
            },
        },
    });
};

export const createAuthLink = (accessToken: string | undefined): ApolloLink => {
    return new ApolloLink((operation, forward) => {
        operation.setContext((context: DefaultContext) => {
            return {
                headers: {
                    authorization: accessToken ? `Bearer ${accessToken}` : '',
                    ...context.headers,
                },
            };
        });

        return forward(operation);
    });
};
