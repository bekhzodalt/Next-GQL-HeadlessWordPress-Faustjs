module.exports = {
	apps: [
		{
			name: 'ul',
			script: 'server.js',
			interpreter: '/usr/bin/yarn', //absolute path to yarn ; default is node
			interpreter_args: '',
			exec_mode: 'cluster',
			instances: '2',
			cron_restart: '0 0 * * *',
			cwd: '.', //the directory from which your app will be launched
			args: 'start', //string containing all arguments passed via CLI to script
			env_staging: {
				PORT: 3002,
				DEPLOYMENT: 'staging'
			},
			env_production: {
				PORT: 3000,
			},
		},
	],
	deploy: {
		staging: {
			user: 'staging',
			host: ['146.190.210.80'],
			ref: 'origin/staging',
			repo: 'git@github.com:ClubLISI/archipress-ul.git',
			path: '/home/staging/unionleague/archipress',
			'post-setup': 'cd ~/unionleague/archipress/source && yarn install',
			'post-deploy':
				'cd ~/unionleague/archipress/source && sh scripts/deploy.sh staging',
		},
		production: {
			user: 'unionleague',
			host: ['142.93.192.178'],
			ref: 'origin/main',
			repo: 'git@github.com:ClubLISI/archipress-ul.git',
			path: '/home/unionleague/production/archipress',
			'post-setup': 'cd ~/production/archipress/source && yarn install',
			'post-deploy':
				'cd ~/production/archipress/source && sh scripts/deploy.sh production',
		},
	},
}
