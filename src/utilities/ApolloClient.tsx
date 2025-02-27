import { ApolloClient, ApolloLink, InMemoryCache, from } from "@apollo/client"
import { tracker } from "@archipress/utilities/OpenReplayTracker";
import createUploadLink from "apollo-upload-client/public/createUploadLink.js";

const apolloTrackerLink = tracker && tracker.graphqlTracker ? new ApolloLink((operation, forward) => {
    const { operationName, variables } = operation
    const kind = operation.query?.definitions ? operation.query.definitions[0].kind : 'unknown?'
    return forward(operation).map(result => {
        return tracker.graphqlTracker(kind, operationName, variables, result)
    })
}) : null

const clientLink = createUploadLink({
    uri: process.env.NEXT_PUBLIC_WORDPRESS_URL + '/graphql',
    credentials: 'include',
}) as any

const link: ApolloLink = apolloTrackerLink ? from([
    apolloTrackerLink,
    clientLink,
]) : clientLink

const apolloClient = new ApolloClient({
    cache: new InMemoryCache(),
    link,
})

export default apolloClient
