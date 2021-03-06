FROM ruby:2.7-alpine

ARG RAILS_ROOT=/task_manager
ARG PACKAGES="vim openssl-dev postgresql-dev build-base curl nodejs yarn less tzdata git postgresql-client bash screen"

RUN apk add --update-cache --upgrade --no-cache $PACKAGES
RUN gem install bundler:2.2

WORKDIR $RAILS_ROOT

COPY Gemfile Gemfile.lock  ./

RUN bundle install --jobs 5

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . $RAILS_ROOT

ENV PATH=$RAILS_ROOT/bin:$PATH

EXPOSE 3000

CMD ["bundle", "exec", "rails", "server", "-b", "0.0.0.0", "-p", "3000"]
