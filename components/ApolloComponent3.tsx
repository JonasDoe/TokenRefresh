'use client'
import React, {useEffect, useState} from 'react';
import {ApolloNextAppProvider,InMemoryCache, ApolloClient} from "@apollo/client-integration-nextjs";
import {ApolloLink, DefaultContext, HttpLink, useQuery, gql, useApolloClient} from "@apollo/client";
import {setContext} from "@apollo/client/link/context";

export const ApolloComponent3: React.FC=()=>{
    const gateway='https://graph.dev.we-create.io/graphql'
    const [accessToken,setAccessToken]=useState('InvalidToken')
    useEffect(() => {
        const timeout=setTimeout(() => setAccessToken('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'),1000);
        return ()=> void timeout.close()
    }, []);
    console.log("In Apollo Component - access token", accessToken);
    const client = createApolloClient(gateway);
    return <ApolloNextAppProvider makeClient={() => {
        console.log('In ApolloNextAppProvider callback')
        return client;
    }}><UpdateAuth accessToken={accessToken}><Inner accessToken={accessToken}></Inner></UpdateAuth></ApolloNextAppProvider>;
}

const Inner: React.FC<{accessToken:string}> = ({accessToken}) => {
    const queryResult = useQuery(gql("query { __schema { __typename  }}"),{
        context: {
            accessToken: accessToken,
        },
        pollInterval: 4000,
    });
    return <div>{accessToken+JSON.stringify(queryResult.error)}</div>
}

export const createApolloClient = (gatewayUrl: string) => {
    const authLink = setContext(async (_, { headers, token }) => {
        return {
            headers: {
                ...headers,
                ...(token ? { authorization: `Bearer ${token}` } : {}),
            },
        };
    });

    return new ApolloClient({
        cache: new InMemoryCache(),
        link: authLink.concat(new HttpLink({ uri: gatewayUrl })),
        defaultOptions: {
            watchQuery: {
                fetchPolicy: 'network-only',
                nextFetchPolicy: 'network-only',
            },
        },
    });
};

export const UpdateAuth:React.FC<{children:React.ReactNode, accessToken:string}>=({ children,accessToken })=> {
    const token =  accessToken // could come from a context
    const apolloClient = useApolloClient()
    apolloClient.defaultContext.token = token
    return <>{children}</>;
}

