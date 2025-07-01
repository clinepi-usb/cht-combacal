# We build the combacal services in three steps
# 1: convert forms and compile settings use the cht-conf command line utility
# 2: run the unit test suite from the combacal project
# 3: upload the new specifications into the community-health-toolkit services

# --- STEP 1: convert forms and compile settings ---

# use a custom combacal cht conf container
FROM dkfbasel/combacal.conf:1.1.0 as conf

# copy the application source code into the container, so that
# we can compile settings and convert forms without affecting the 
# original source code repository
# NOTE: the context has to be set to the project source code when buildling the image outside of bitbucket
# files which should not be copied are defined in the .dockerignore file
COPY . /app/
WORKDIR /app

# add the node modules from the global npm folder from the conf container
# to the projects node_modules folder. this will add pre-installed
# eslint configuration files: @medic/eslint-config
RUN npm install
RUN cp -R /usr/local/lib/node_modules/* /app/node_modules


# the compile steps are taken from: https://combacal.atlassian.net/wiki/spaces/COMBACAL/pages/115965953/Development+Setup
# convert app forms
RUN cht --local convert-app-forms

# convert contact forms
RUN cht --local convert-contact-forms

# compile application settings
# compiles : (https://github.com/medic/cht-conf)
#  - tasks
#  - rules
#  - schedules
#  - contact-summary
#  - purge
RUN cht --local compile-app-settings

# --- STEP 2: run the unit test suite ---

# use a custom node puppeteer test runner container
FROM dkfbasel/combacal.test:1.0.0 as test

# copy the source code with compiled files into the test container
COPY --from=conf /app /app

# add the node modules from the global npm folder from the test container
# to the projects node_moduels folder. this will add pre-installed
# puppeteer and testing libraries
RUN cp -R /usr/lib/node_modules/* /app/node_modules

# ensure that the current working directory is in the source directory
WORKDIR /app

# run the test istanbul test suitetest
RUN nyc mocha --recursive

RUN echo "Test successfully completed"

# --- STEP 3: upload the compiled forms and settings to the cht services ---

FROM conf as upload

# copy compiled or converted information of STEP 1
# - app forms
# - contact forms
# - app settings

# forms: contains app forms and contact
COPY --from=conf /app/forms /app/forms
COPY --from=conf /app/contact-summary.templated.js /app/contact-summary.templated.js
COPY --from=conf /app/contact-summary-extras.js /app/contact-summary-extras.js

# app settings
COPY --from=conf /app/app_settings /app/app_settings
COPY --from=conf /app/app_settings.json /app/app_settings.json

# resources
COPY --from=conf /app/resources /app/resources
COPY --from=conf /app/resources.json /app/resources.json

# translations
COPY --from=conf /app/translations /app/translations

# branding (necessary?): i guess not, as the branding is never uploaded (cht-action: "upload-branding")
COPY --from=conf /app/branding /app/branding

# data (necessary?)
COPY --from=conf /app/data /app/data

# tasks
COPY --from=conf /app/tasks /app/tasks
COPY --from=conf /app/tasks.js /app/tasks.js

# nools-extras
COPY --from=conf /app/nools-extras.js /app/nools-extras.js

# targets (already contained in compile compile-app-settings )
COPY --from=conf /app/targets.js /app/targets.js

# eslintrc (for?)
COPY --from=conf /app/.eslintrc /app/.eslintrc

# upload script
COPY --from=conf /app/dockerize/build_env/uploadData.sh /app/bin/uploadData.sh

# use app as working directory as cht will upload the forms from
# the current directory
WORKDIR /app

#upload settings, app-forms, contact-forms, resources and labels
RUN chmod +x /app/bin/uploadData.sh

ENTRYPOINT ["/app/bin/uploadData.sh"]