- Metamodel: Business Metamodel
- id:: biz.kNN
- name:: Business metamodel
- version:: 1.0.0
- Item Types
	- Business summary
	  collapsed:: true
	  instantiable:: true
	  name:: Business summary
	  slug:: business-summary
	  type:: text
	  summary:: Brief description of your business, how it creates value for whom, and the logic behind how it generates revenue.
	  weight:: 90
	  guide:: Complete the item
	  mode:: basic
	  color:: blue
	  aiFit:: 9
	  emoji:: 📄
	  fields::
	  relations::
	- Market
	  collapsed:: true
	  instantiable:: true
	  name:: Market
	  slug:: market
	  type:: category
	  weight:: 90
	  guide:: Complete the item
	  mode:: basic
	  color:: blue
	  emoji:: 📂
	  fields::
	  relations::
	- [[Stakeholders]]
	  collapsed:: true
	  instantiable:: true
	  name:: Stakeholders
	  slug:: stakeholders
	  parentItem:: [[Market]]
	  type:: weight
	  summary:: A stakeholder in business is any individual or group with an interest in or influence over a company's activities, decisions, and goals, with the primary stakeholder always being the customer.
	  weight:: 80
	  guide:: Complete the item
	  mode:: basic
	  color:: blue
	  aiFit:: 9
	  emoji:: 🤔
	  fields::
		- collapsed:: true
		- name:: stakeholder_type
		  type:: select
		  label:: Stakeholder Type
		  required:: false
		  options:: partner, customer, investor, other
		  relations::
	- Segments
	  collapsed:: true
	  instantiable:: true
	  name:: Segments
	  slug:: segments
	  parentItem:: [[Market]]
	  type:: weight
	  summary:: A segment list refers to a categorized compilation of target customer groups based on shared characteristics or needs.
	  weight:: 70
	  guide:: Complete the item
	  mode:: basic
	  color:: blue
	  aiFit:: 9
	  emoji:: 🙋
	  fields::
	  relations::
	- Profiles
	  collapsed:: true
	  instantiable:: true
	  name:: Profiles
	  slug:: profiles
	  parentItem:: [[Segments]]
	  type:: weight
	  summary:: A definition of who our client is narrowing down the segmentation criteria to specific values.
	  weight:: 80
	  guide:: Complete the item
	  mode:: basic
	  color:: blue
	  aiFit:: 9
	  emoji:: 🙎
	  fields::
	  relations::
	- Segmentation
	  collapsed:: true
	  instantiable:: true
	  name:: Segmentation
	  slug:: segmentation
	  parentItem:: [[Segments]]
	  type:: weight
	  summary:: Segmentation criteria are the variables or characteristics used to divide a market into smaller, more homogeneous groups, known as segments..\nThe process of dividing a market into distinct groups of customers with similar needs or characteristics by assigning specific values or value ranges to the segment's segmentation criteria.
	  weight:: 60
	  guide:: Complete the item
	  mode:: advanced
	  color:: blue
	  aiFit:: 6
	  emoji:: ✂️
	  fields::
	  relations::
	- Market trends
	  collapsed:: true
	  instantiable:: true
	  name:: Market trends
	  slug:: market-trends
	  parentItem:: [[Segments]]
	  type:: weight
	  summary:: The identification and analysis of specific customer groups and their evolving needs and preferences within a business model.
	  weight:: 20
	  guide:: Complete the item
	  mode:: expert
	  color:: blue
	  aiFit:: 8
	  emoji:: 📈
	  fields::
	  relations::
	- Market size
	  collapsed:: true
	  instantiable:: true
	  name:: Market size
	  slug:: market-size
	  parentItem:: [[Segments]]
	  type:: text
	  summary:: Size of a market is the amount of money that is involved in transactions between suppliers and customers
	  weight:: 50
	  guide:: Complete the item
	  mode:: advanced
	  color:: blue
	  aiFit:: 8
	  emoji:: 📄
	  fields::
	  relations::
	- Competition
	  collapsed:: true
	  instantiable:: true
	  name:: Competition
	  slug:: competition
	  parentItem:: [[Segments]]
	  type:: weight
	  summary:: Entities or organizations or people who are trying to solve the same problems for the same clients.
	  weight:: 40
	  guide:: Complete the item
	  mode:: advanced
	  color:: blue
	  aiFit:: 8
	  emoji:: 🏅
	  fields::
	  relations::
	- Roles
	  collapsed:: true
	  instantiable:: true
	  name:: Roles
	  slug:: roles
	  parentItem:: [[Segments]]
	  type:: weight
	  summary:: Roles involved in the purchasing decision of our product or service by the customers. For example, it can be the financial director, the technical director, a member of the core family, etcetera.
	  weight:: 30
	  guide:: Complete the item
	  mode:: expert
	  color:: blue
	  aiFit:: 6
	  emoji:: 🎩
	  fields::
	  relations::
	- Persona
	  collapsed:: true
	  instantiable:: true
	  name:: Persona
	  slug:: persona
	  parentItem:: [[Segments]]
	  type:: text
	  summary:: Client archetype with many details about their circumstances that helps us understand and connect with our clients. It also serves to communicate to whom we are addressing.
	  weight:: 40
	  guide:: Complete the item
	  mode:: advanced
	  color:: blue
	  aiFit:: 6
	  emoji:: 📄
	  fields::
	  relations::
	- Problems
	  collapsed:: true
	  instantiable:: true
	  name:: Problems
	  slug:: problems
	  parentItem:: [[Segments]]
	  type:: weight
	  summary:: Problems, needs or desires that our stakeholders have and are relevant to my business.
	  weight:: 85
	  guide:: Complete the item
	  mode:: basic
	  color:: blue
	  aiFit:: 9
	  emoji:: 😟
	  fields::
	  relations::
	- Value propositions
	  collapsed:: true
	  instantiable:: true
	  name:: Value propositions
	  slug:: value-propositions
	  parentItem:: [[Segments]]
	  type:: weight
	  summary:: The reason that will convince this profile to take the action we want them to take, such as buying a product.
	  weight:: 70
	  guide:: Complete the item
	  mode:: basic
	  color:: blue
	  aiFit:: 9
	  emoji:: 💎
	  fields::
	  relations::
	- Messages
	  collapsed:: true
	  instantiable:: true
	  name:: Messages
	  slug:: messages
	  parentItem:: [[Segments]]
	  type:: weight
	  summary:: Messages that we want to communicate to... that they carry out a specific action.
	  weight:: 40
	  guide:: Complete the item
	  mode:: advanced
	  color:: blue
	  aiFit:: 6
	  emoji:: 📣
	  fields::
	  relations::
	- Channels
	  collapsed:: true
	  instantiable:: true
	  name:: Channels
	  slug:: channels
	  parentItem:: [[Segments]]
	  type:: weight
	  summary:: Means through which we interact with our clients throughout the customer journey. Channels represent the means through which a company delivers its value proposition to its customers.
	  weight:: 70
	  guide:: Complete the item
	  mode:: basic
	  color:: blue
	  aiFit:: 8
	  emoji:: 🎙️
	  fields::
	  relations::
	- Relationships
	  collapsed:: true
	  instantiable:: true
	  name:: Relationships
	  slug:: relationships
	  parentItem:: [[Segments]]
	  type:: text
	  summary:: Relationship that we maintain with our stakeholders, which can be personal, automated, self-service, etc.
	  weight:: 50
	  guide:: Complete the item
	  mode:: advanced
	  color:: blue
	  aiFit:: 4
	  emoji:: 🤝
	  fields::
	  relations::
	- Perceptions
	  collapsed:: true
	  instantiable:: true
	  name:: Perceptions
	  slug:: perceptions
	  parentItem:: [[Segments]]
	  type:: weight
	  summary:: Signals that our stakeholders receive... that generate some kind of emotion for them
	  weight:: 40
	  guide:: Complete the item
	  mode:: advanced
	  color:: blue
	  aiFit:: 7
	  emoji:: 👁️
	  fields::
	  relations::
	- Emotions
	  collapsed:: true
	  instantiable:: true
	  name:: Emotions
	  slug:: emotions
	  parentItem:: [[Segments]]
	  type:: weight
	  summary:: Emotions that our stakeholders feel and that are relevant to empathize with them and be able to design a value proposition that resonates with them.
	  weight:: 40
	  guide:: Complete the item
	  mode:: advanced
	  color:: blue
	  aiFit:: 8
	  emoji:: 😐
	  fields::
	  relations::
	- Behaviors
	  collapsed:: true
	  instantiable:: true
	  name:: Behaviors
	  slug:: behaviors
	  parentItem:: [[Segments]]
	  type:: weight
	  summary:: Behaviors refers to what customers express (say) and their observable actions (do) during their experience with a product or service, both the verbal feedback provided by customers—such as comments, quotes, and reviews—and their actual behaviors or interactions.
	  weight:: 40
	  guide:: Complete the item
	  mode:: advanced
	  color:: blue
	  aiFit:: 5
	  emoji:: 🦾
	  fields::
	  relations::
	- Journey
	  collapsed:: true
	  instantiable:: true
	  name:: Journey
	  slug:: journey
	  parentItem:: [[Segments]]
	  type:: steps
	  summary:: The Stateholder's journey is a sequence formed by the different stages that a stakeholder goes through in their relationship with my business.
	  weight:: 40
	  guide:: Complete the item
	  mode:: advanced
	  color:: blue
	  aiFit:: 6
	  emoji:: ✈️
	  fields::
	  relations::
	- Solutions
	  collapsed:: true
	  instantiable:: true
	  name:: Solutions
	  slug:: solutions
	  type:: category
	  weight:: 90
	  guide:: Complete the item
	  mode:: basic
	  color:: blue
	  emoji:: 📂
	  fields::
	  relations::
	- Products and services
	  collapsed:: true
	  instantiable:: true
	  name:: Products and services
	  slug:: products-and-services
	  parentItem:: [[Solutions]]
	  type:: weight
	  summary:: the products, services, or processes that a business offers to address the needs or problems of its customers.
	  weight:: 80
	  guide:: Complete the item
	  mode:: basic
	  color:: blue
	  aiFit:: 9
	  emoji:: 💊
	  fields::
	  relations::
	- Portfolio
	  collapsed:: true
	  instantiable:: true
	  name:: Portfolio
	  slug:: portfolio
	  parentItem:: [[Products and services]]
	  type:: text
	  weight:: 80
	  guide:: Complete the item
	  mode:: basic
	  color:: blue
	  emoji:: 💼
	  fields::
	  relations::
	- Components
	  collapsed:: true
	  instantiable:: true
	  name:: Components
	  slug:: components
	  parentItem:: [[Products and services]]
	  type:: weight
	  summary:: Technologies and components that are part of the final solution, that is, the product or service offered to the customer to solve their problem. For example, the programming language used, the cloud platform used, or the parts that are part of the... in the case of being a physical product.
	  weight:: 20
	  guide:: Complete the item
	  mode:: expert
	  color:: blue
	  aiFit:: 3
	  emoji:: 🧩
	  fields::
	  relations::
	- Features
	  collapsed:: true
	  instantiable:: true
	  name:: Features
	  slug:: features
	  parentItem:: [[Products and services]]
	  type:: weight
	  summary:: the unique characteristics and functionalities of a product or service that addresses the needs of a specific customer segment within a business model.
	  weight:: 40
	  guide:: Complete the item
	  mode:: advanced
	  color:: blue
	  aiFit:: 6
	  emoji:: 🌟
	  fields::
	  relations::
	- Roadmap
	  collapsed:: true
	  instantiable:: true
	  name:: Roadmap
	  slug:: roadmap
	  parentItem:: [[Products and services]]
	  type:: steps
	  summary:: plan that outlines the steps and strategies needed to implement a business model solution.
	  weight:: 20
	  guide:: Complete the item
	  mode:: expert
	  color:: blue
	  aiFit:: 3
	  emoji:: 📄
	  fields::
	  relations::
	- Pricing
	  collapsed:: true
	  instantiable:: true
	  name:: Pricing
	  slug:: pricing
	  parentItem:: [[Products and services]]
	  type:: text
	  summary:: The approach the business will take to determine the price points for its products or services. It considers various factors, including the cost structure, target market positioning, perceived value, and competitive landscape.
	  weight:: 40
	  guide:: Complete the item
	  mode:: advanced
	  color:: blue
	  aiFit:: 8
	  emoji:: 📄
	  fields::
	  relations::
	- Offerings
	  collapsed:: true
	  instantiable:: true
	  name:: Offerings
	  slug:: offerings
	  parentItem:: [[Products and services]]
	  type:: weight
	  summary:: the products or services that a business model provides to its customers to fulfill their needs or solve their problems.
	  weight:: 40
	  guide:: Complete the item
	  mode:: advanced
	  color:: blue
	  aiFit:: 5
	  emoji:: 🛍️
	  fields::
	  relations::
	- Marketing
	  collapsed:: true
	  instantiable:: true
	  name:: Marketing
	  slug:: marketing
	  parentItem:: [[Solutions]]
	  type:: category
	  summary:: Marketing is the process of identifying and satisfying customer needs through the creation, promotion, and distribution of products or services.
	  weight:: 60
	  guide:: Complete the item
	  mode:: advanced
	  color:: blue
	  aiFit:: 9
	  emoji:: 📂
	  fields::
	  relations::
	- Naming
	  collapsed:: true
	  instantiable:: true
	  name:: Naming
	  slug:: naming
	  parentItem:: [[Marketing]]
	  type:: text
	  summary:: the process of choosing and defining the name of a business, product, or service within a business model.
	  weight:: 40
	  guide:: Complete the item
	  mode:: advanced
	  color:: blue
	  aiFit:: 5
	  emoji:: 📄
	  fields::
	  relations::
	- Branding
	  collapsed:: true
	  instantiable:: true
	  name:: Branding
	  slug:: branding
	  parentItem:: [[Marketing]]
	  type:: text
	  summary:: Branding is the process of creating a unique image and identity for a business, product, or service.
	  weight:: 40
	  guide:: Complete the item
	  mode:: advanced
	  color:: blue
	  aiFit:: 3
	  emoji:: 📄
	  fields::
	  relations::
	- Visual identity
	  collapsed:: true
	  instantiable:: true
	  name:: Visual identity
	  slug:: visual-identity
	  parentItem:: [[Marketing]]
	  type:: text
	  summary:: the overall look and feel of a company's brand, including its logo, color scheme, typography, and other visual elements.
	  weight:: 10
	  guide:: Complete the item
	  mode:: expert
	  color:: blue
	  aiFit:: 2
	  emoji:: 📄
	  fields::
	  relations::
	- Logo
	  collapsed:: true
	  instantiable:: true
	  name:: Logo
	  slug:: logo
	  parentItem:: [[Marketing]]
	  type:: text
	  summary:: A logo is a visual symbol or design that represents a company or brand and is used to promote recognition and awareness.
	  weight:: 10
	  guide:: Complete the item
	  mode:: expert
	  color:: blue
	  aiFit:: 2
	  emoji:: 📄
	  fields::
	  relations::
	- Media plan
	  collapsed:: true
	  instantiable:: true
	  name:: Media plan
	  slug:: media-plan
	  parentItem:: [[Marketing]]
	  type:: text
	  summary:: A marketing plan outlines the strategies and tactics a business will use to promote and sell its products or services.
	  weight:: 10
	  guide:: Complete the item
	  mode:: expert
	  color:: blue
	  aiFit:: 2
	  emoji:: 📄
	  fields::
	  relations::
	- Communication
	  collapsed:: true
	  instantiable:: true
	  name:: Communication
	  slug:: communication
	  parentItem:: [[Solutions]]
	  type:: category
	  summary:: the exchange of_information and ideas between the company and its stakeholders.
	  weight:: 50
	  guide:: Complete the item
	  mode:: advanced
	  color:: blue
	  aiFit:: 7
	  emoji:: 📂
	  fields::
	  relations::
	- Pitch
	  collapsed:: true
	  instantiable:: true
	  name:: Pitch
	  slug:: pitch
	  parentItem:: [[Communication]]
	  type:: text
	  summary:: A pitch is a concise and compelling presentation of a business idea or model to potential investors or customers.
	  weight:: 40
	  guide:: Complete the item
	  mode:: advanced
	  color:: blue
	  aiFit:: 6
	  emoji:: 📄
	  fields::
	  relations::
	- Brochure
	  collapsed:: true
	  instantiable:: true
	  name:: Brochure
	  slug:: brochure
	  parentItem:: [[Products and services]]
	  type:: text
	  summary:: Basic piece of_information that should be provided to the end customer so that they know the advantages of using our product or service.
	  weight:: 40
	  guide:: Complete the item
	  mode:: advanced
	  color:: blue
	  aiFit:: 5
	  emoji:: 📄
	  fields::
	  relations::
	- Web
	  collapsed:: true
	  instantiable:: true
	  name:: Web
	  slug:: web
	  parentItem:: [[Communication]]
	  type:: text
	  summary:: the online platform or digital presence of a business model, which includes websites, social media, and other online channels.
	  weight:: 40
	  guide:: Complete the item
	  mode:: advanced
	  color:: blue
	  aiFit:: 4
	  emoji:: 📄
	  fields::
	  relations::
	- Storytelling
	  collapsed:: true
	  instantiable:: true
	  name:: Storytelling
	  slug:: storytelling
	  parentItem:: [[Communication]]
	  type:: text
	  summary:: the use of narrative techniques to communicate the brand's purpose, values, and mission to customers.
	  weight:: 20
	  guide:: Complete the item
	  mode:: expert
	  color:: blue
	  aiFit:: 3
	  emoji:: 📄
	  fields::
	  relations::
	- Presentations
	  collapsed:: true
	  instantiable:: true
	  name:: Presentations
	  slug:: presentations
	  parentItem:: [[Communication]]
	  type:: text
	  summary:: the way in which a business model is communicated or visually represented to stakeholders.
	  weight:: 35
	  guide:: Complete the item
	  mode:: advanced
	  color:: blue
	  aiFit:: 3
	  emoji:: 📄
	  fields::
	  relations::
	- Organization
	  collapsed:: true
	  instantiable:: true
	  name:: Organization
	  slug:: organization
	  type:: category
	  weight:: 60
	  guide:: Complete the item
	  mode:: advanced
	  color:: blue
	  emoji:: 📂
	  fields::
	  relations::
	- Business idea
	  collapsed:: true
	  instantiable:: true
	  name:: Business idea
	  slug:: business-idea
	  parentItem:: [[Organization]]
	  type:: category
	  summary:: A business idea refers to a unique concept or proposition that forms the foundation of a business model.
	  weight:: 60
	  guide:: Complete the item
	  mode:: advanced
	  color:: blue
	  aiFit:: 7
	  emoji:: 📂
	  fields::
	  relations::
	- Inspiration
	  collapsed:: true
	  instantiable:: true
	  name:: Inspiration
	  slug:: inspiration
	  parentItem:: [[Business idea]]
	  type:: weight
	  summary:: Inspiration in the context of a business model refers to the creative spark that drives innovative ideas and solutions. It can refer to anything (aphenomenon, idea, competitor,,,) that serves as a foundation for an entrepreneur to create a new business.
	  weight:: 30
	  guide:: Complete the item
	  mode:: expert
	  color:: blue
	  aiFit:: 3
	  emoji:: 📄
	  fields::
	  relations::
	- Opportunity
	  collapsed:: true
	  instantiable:: true
	  name:: Opportunity
	  slug:: opportunity
	  parentItem:: [[Business idea]]
	  type:: weight
	  summary:: An opportunity is a potential area for a business to generate revenue or create value for customers within its business model.
	  weight:: 40
	  guide:: Complete the item
	  mode:: advanced
	  color:: blue
	  aiFit:: 5
	  emoji:: 📄
	  fields::
	  relations::
	- Business status
	  collapsed:: true
	  instantiable:: true
	  name:: Business status
	  slug:: business-status
	  parentItem:: [[Business idea]]
	  type:: text
	  summary:: The business status refers to the current condition or status of a business, including its operations, performance, and market position.
	  weight:: 70
	  guide:: Complete the item
	  mode:: basic
	  color:: blue
	  aiFit:: 5
	  emoji:: 📄
	  fields::
	  relations::
	- Challenges
	  collapsed:: true
	  instantiable:: true
	  name:: Challenges
	  slug:: challenges
	  parentItem:: [[Business idea]]
	  type:: weight
	  summary:: Challenges refer to obstacles or difficulties that hinder the achievement of desired outcomes.
	  weight:: 20
	  guide:: Complete the item
	  mode:: expert
	  color:: blue
	  aiFit:: 4
	  emoji:: 📄
	  fields::
	  relations::
	- Business objectives
	  collapsed:: true
	  instantiable:: true
	  name:: Business objectives
	  slug:: business-objectives
	  parentItem:: [[Organization]]
	  type:: category
	  summary:: Business objectives are the targets that a business model aims to achieve in order to create value for its stakeholders.
	  weight:: 70
	  guide:: Complete the item
	  mode:: basic
	  color:: blue
	  aiFit:: 9
	  emoji:: 🧠
	  fields::
	  relations::
	- Mission
	  collapsed:: true
	  instantiable:: true
	  name:: Mission
	  slug:: mission
	  parentItem:: [[Business objectives]]
	  type:: text
	  summary:: The purpose or reason for the existence of a business.
	  weight:: 50
	  guide:: Complete the item
	  mode:: advanced
	  color:: blue
	  aiFit:: 6
	  emoji:: 🎯
	  fields::
	  relations::
	- Vision
	  collapsed:: true
	  instantiable:: true
	  name:: Vision
	  slug:: vision
	  parentItem:: [[Business objectives]]
	  type:: text
	  summary:: Vision is a statement that outlines the long-term aspirations and goals of a business model.
	  weight:: 40
	  guide:: Complete the item
	  mode:: advanced
	  color:: blue
	  aiFit:: 5
	  emoji:: 📄
	  fields::
	  relations::
	- Organizational values
	  collapsed:: true
	  instantiable:: true
	  name:: Organizational values
	  slug:: organizational-values
	  parentItem:: [[Business objectives]]
	  type:: weight
	  summary:: The principles, beliefs, and attitudes that guide the behavior and decision-making of a business and its stakeholders.
	  weight:: 35
	  guide:: Complete the item
	  mode:: advanced
	  color:: blue
	  aiFit:: 5
	  emoji:: ⚙️
	  fields::
	  relations::
	- Organizational goals
	  collapsed:: true
	  instantiable:: true
	  name:: Organizational goals
	  slug:: organizational-goals
	  parentItem:: [[Business objectives]]
	  type:: weight
	  summary:: Organizational goals are the specific objectives that a business model aims to achieve (for example, in terms of revenue, growth, profitability, or market share)
	  weight:: 60
	  guide:: Complete the item
	  mode:: advanced
	  color:: blue
	  aiFit:: 3
	  emoji:: 👔
	  fields::
	  relations::
	- Operations
	  collapsed:: true
	  instantiable:: true
	  name:: Operations
	  slug:: operations
	  parentItem:: [[Organization]]
	  type:: category
	  summary:: The activities and processes involved in delivering a product or service to customers within a business model.
	  weight:: 50
	  guide:: Complete the item
	  mode:: advanced
	  color:: blue
	  aiFit:: 6
	  emoji:: ⭐
	  fields::
	  relations::
	- Activities
	  collapsed:: true
	  instantiable:: true
	  name:: Activities
	  slug:: activities
	  parentItem:: [[Operations]]
	  type:: weight
	  summary:: the tasks or processes that a business engages in to create, deliver, and capture value for its customers.
	  weight:: 40
	  guide:: Complete the item
	  mode:: advanced
	  color:: blue
	  aiFit:: 6
	  emoji:: 👤
	  fields::
	  relations::
	- Functions
	  collapsed:: true
	  instantiable:: true
	  name:: Functions
	  slug:: functions
	  parentItem:: [[Operations]]
	  type:: weight
	  summary:: High-level specification of the set of tasks that are necessary to carry out a business activity towards the achievement of a business goal.
	  weight:: 30
	  guide:: Complete the item
	  mode:: expert
	  color:: blue
	  aiFit:: 4
	  emoji:: 🎯
	  fields::
	  relations::
	- Resources
	  collapsed:: true
	  instantiable:: true
	  name:: Resources
	  slug:: resources
	  parentItem:: [[Operations]]
	  type:: weight
	  summary:: the assets, capabilities, and infrastructure a business uses to create and deliver value to its customers.
	  weight:: 30
	  guide:: Complete the item
	  mode:: expert
	  color:: blue
	  aiFit:: 4
	  emoji:: 🔧
	  fields::
	  relations::
	- Team
	  collapsed:: true
	  instantiable:: true
	  name:: Team
	  slug:: team
	  parentItem:: [[Organization]]
	  type:: category
	  summary:: A group of individuals working together towards a common goal within a business model.
	  weight:: 70
	  guide:: Complete the item
	  mode:: basic
	  color:: blue
	  aiFit:: 3
	  emoji:: ➡️
	  fields::
	  relations::
	- Goals
	  collapsed:: true
	  instantiable:: true
	  name:: Goals
	  slug:: goals
	  parentItem:: [[Team]]
	  type:: weight
	  weight:: 30
	  guide:: Complete the item
	  mode:: expert
	  color:: blue
	  aiFit:: 3
	  emoji:: ⬅️
	  fields::
	  relations::
	- Skills
	  collapsed:: true
	  instantiable:: true
	  name:: Skills
	  slug:: skills
	  parentItem:: [[Team]]
	  type:: weight
	  summary:: The unique identification and competencies of individuals within a team.
	  weight:: 30
	  guide:: Complete the item
	  mode:: expert
	  color:: blue
	  aiFit:: 3
	  emoji:: 🪪
	  fields::
	  relations::
	- Contributions
	  collapsed:: true
	  instantiable:: true
	  name:: Contributions
	  slug:: contributions
	  parentItem:: [[Team]]
	  type:: weight
	  summary:: The multiple resources or inputs that an individual provides to the company, highlighting the variety and range of valuable assets they bring to the organization's operations and growth.
	  weight:: 10
	  guide:: Complete the item
	  mode:: expert
	  color:: blue
	  aiFit:: 3
	  emoji:: 📄
	  fields::
	  relations::
	- Compensations
	  collapsed:: true
	  instantiable:: true
	  name:: Compensations
	  slug:: compensations
	  parentItem:: [[Team]]
	  type:: weight
	  summary:: The various forms of remuneration, benefits, and rewards that a company provides to an individual in exchange for their contributions. This can include salary, bonuses, stock options, health benefits, retirement plans, and other perks that constitute the total compensation package offered to employees or collaborators for their valuable inputs to the company.
	  weight:: 10
	  guide:: Complete the item
	  mode:: expert
	  color:: blue
	  aiFit:: 3
	  emoji:: 🗓️
	  fields::
	  relations::
	- Positions
	  collapsed:: true
	  instantiable:: true
	  name:: Positions
	  slug:: positions
	  parentItem:: [[Team]]
	  type:: weight
	  summary:: A position list refers to a strategic document outlining the roles, responsibilities, and hierarchy of positions within a business.
	  weight:: 20
	  guide:: Complete the item
	  mode:: expert
	  color:: blue
	  aiFit:: 3
	  emoji:: 🏁
	  fields::
	  relations::
	- Project plan
	  collapsed:: true
	  instantiable:: true
	  name:: Project plan
	  slug:: project-plan
	  parentItem:: [[Organization]]
	  type:: category
	  summary:: A project is a temporary endeavor with a specific goal or objective that contributes to the overall business model.
	  weight:: 30
	  guide:: Complete the item
	  mode:: expert
	  color:: blue
	  aiFit:: 7
	  emoji:: 📐
	  fields::
	  relations::
	- Phases
	  collapsed:: true
	  instantiable:: true
	  name:: Phases
	  slug:: phases
	  parentItem:: [[Project plan]]
	  type:: steps
	  summary:: the distinct stages or steps involved in the development, implementation, and evolution of a business model.
	  weight:: 20
	  guide:: Complete the item
	  mode:: expert
	  color:: blue
	  aiFit:: 7
	  emoji:: 📂
	  fields::
	  relations::
	- Milestones
	  collapsed:: true
	  instantiable:: true
	  name:: Milestones
	  slug:: milestones
	  parentItem:: [[Project plan]]
	  type:: sequence
	  summary:: Milestones are specific achievements or events that mark significant progress or success in a business model.
	  weight:: 10
	  guide:: Complete the item
	  mode:: expert
	  color:: blue
	  aiFit:: 5
	  emoji:: 💰
	  fields::
	  relations::
	- Metrics
	  collapsed:: true
	  instantiable:: true
	  name:: Metrics
	  slug:: metrics
	  parentItem:: [[Organization]]
	  type:: weight
	  summary:: Metrics are quantifiable measures used to evaluate the performance and effectiveness of a business model.
	  weight:: 50
	  guide:: Complete the item
	  mode:: advanced
	  color:: blue
	  aiFit:: 7
	  emoji:: 📄
	  fields::
	  relations::
	- Finance
	  collapsed:: true
	  instantiable:: true
	  name:: Finance
	  slug:: finance
	  parentItem:: [[Organization]]
	  type:: category
	  summary:: The management of financial resources and the allocation of funds within a business model.
	  weight:: 70
	  guide:: Complete the item
	  mode:: basic
	  color:: blue
	  aiFit:: 9
	  emoji:: 💸
	  fields::
	  relations::
	- Revenue
	  collapsed:: true
	  instantiable:: true
	  name:: Revenue
	  slug:: revenue
	  parentItem:: [[Finance]]
	  type:: weight
	  summary:: The various sources of income that a business model generates through its offerings
	  weight:: 65
	  guide:: Complete the item
	  mode:: advanced
	  color:: blue
	  aiFit:: 8
	  emoji:: 📄
	  fields::
	  relations::
	- Life Time Value
	  collapsed:: true
	  instantiable:: true
	  name:: Life Time Value
	  slug:: life-time-value
	  parentItem:: [[Finance]]
	  type:: text
	  summary:: Lifetime value is the net present value of the total revenue a customer will generate over their relationship with a business.
	  weight:: 35
	  guide:: Complete the item
	  mode:: advanced
	  color:: blue
	  aiFit:: 5
	  emoji:: 📄
	  fields::
	  relations::
	- Costs
	  collapsed:: true
	  instantiable:: true
	  name:: Costs
	  slug:: costs
	  parentItem:: [[Finance]]
	  type:: weight
	  summary:: the expenses incurred in the production and delivery of a product or service within a business model.
	  weight:: 50
	  guide:: Complete the item
	  mode:: advanced
	  color:: blue
	  aiFit:: 8
	  emoji:: 💵
	  fields::
	  relations::
	- Customer Aquisition Cost
	  collapsed:: true
	  instantiable:: true
	  name:: Customer Aquisition Cost
	  slug:: customer-aquisition-cost
	  parentItem:: [[Finance]]
	  type:: text
	  summary:: The cost incurred by a business to attract and convert a new customer.
	  weight:: 35
	  guide:: Complete the item
	  mode:: advanced
	  color:: blue
	  aiFit:: 5
	  emoji:: 💼
	  fields::
	  relations::
	- Unit economics
	  collapsed:: true
	  instantiable:: true
	  name:: Unit economics
	  slug:: unit-economics
	  parentItem:: [[Finance]]
	  type:: text
	  summary:: the financial analysis of the revenue and costs associated with a single unit of a product or service.
	  weight:: 25
	  guide:: Complete the item
	  mode:: expert
	  color:: blue
	  aiFit:: 5
	  emoji:: 📄
	  fields::
	  relations::
	- Funding sources
	  collapsed:: true
	  instantiable:: true
	  name:: Funding sources
	  slug:: funding-sources
	  parentItem:: [[Finance]]
	  type:: weight
	  summary:: the various ways a business model generates revenue or acquires capital to support its operations.
	  weight:: 25
	  guide:: Complete the item
	  mode:: expert
	  color:: blue
	  aiFit:: 5
	  emoji:: 📂
	  fields::
	  relations::
	- Shareholders
	  collapsed:: true
	  instantiable:: true
	  name:: Shareholders
	  slug:: shareholders
	  parentItem:: [[Finance]]
	  type:: weight
	  summary:: the financial resources, assets, and investments that a business uses to generate income and support its operations.
	  weight:: 20
	  guide:: Complete the item
	  mode:: expert
	  color:: blue
	  aiFit:: 3
	  emoji:: 📄
	  fields::
	  relations::
	- Projections
	  collapsed:: true
	  instantiable:: true
	  name:: Projections
	  slug:: projections
	  parentItem:: [[Finance]]
	  type:: weight
	  summary:: Cashflow projections are estimates of the expected inflows and outflows of cash in a business model over a specific period.
	  weight:: 20
	  guide:: Complete the item
	  mode:: expert
	  color:: blue
	  aiFit:: 5
	  emoji:: 📄
	  fields::
	  relations::
	- Legal
	  collapsed:: true
	  instantiable:: true
	  name:: Legal
	  slug:: legal
	  parentItem:: [[Organization]]
	  type:: category
	  summary:: the compliance of a business model with laws and regulations governing its operations and interactions with stakeholders.
	  weight:: 40
	  guide:: Complete the item
	  mode:: advanced
	  color:: blue
	  aiFit:: 6
	  emoji:: 📂
	  fields::
	  relations::
	- Legal issues
	  collapsed:: true
	  instantiable:: true
	  name:: Legal issues
	  slug:: legal-issues
	  parentItem:: [[Legal]]
	  type:: weight
	  summary:: the potential consequences or obligations that arise from the legal framework within which a business model operates.
	  weight:: 40
	  guide:: Complete the item
	  mode:: advanced
	  color:: blue
	  aiFit:: 5
	  emoji:: 🔮
	  fields::
	  relations::
	- Contracts
	  collapsed:: true
	  instantiable:: true
	  name:: Contracts
	  slug:: contracts
	  parentItem:: [[Legal]]
	  type:: weight
	  summary:: A contract list refers to a comprehensive inventory of all the agreements and legal obligations between a business and its stakeholders.
	  weight:: 10
	  guide:: Complete the item
	  mode:: expert
	  color:: blue
	  aiFit:: 2
	  emoji:: 🚨
	  fields::
	  relations::
	- Matrices
	  collapsed:: true
	  instantiable:: true
	  name:: Matrices
	  slug:: matrices
	  type:: weight
	  weight:: 40
	  guide:: Complete the item
	  mode:: advanced
	  emoji:: 📄
	  fields::
	  relations::
	- Analysis
	  collapsed:: true
	  instantiable:: true
	  name:: Analysis
	  slug:: analysis
	  type:: category
	  summary:: The process of examining and evaluating the different components of the business model to identify their importance and coherence and determine the risks it entails.
	  weight:: 80
	  guide:: Complete the item
	  mode:: basic
	  color:: red
	  aiFit:: 8
	  emoji:: 📄
	  fields::
	  relations::
	- Assumptions
	  collapsed:: true
	  instantiable:: true
	  name:: Assumptions
	  slug:: assumptions
	  parentItem:: [[Analysis]]
	  type:: weight
	  summary:: Assumptions refer to the hypotheses or beliefs that underpin a business idea or model. These are the uncertain elements about customers, markets, or products that must be validated to ensure the viability and success of the business.
	  weight:: 50
	  guide:: Complete the item
	  mode:: advanced
	  color:: red
	  aiFit:: 3
	  emoji:: 📄
	  fields::
	  relations::
	- Risks
	  collapsed:: true
	  instantiable:: true
	  name:: Risks
	  slug:: risks
	  parentItem:: [[Analysis]]
	  type:: weight
	  summary:: Potential negative outcomes or uncertainties that may affect the success and sustainability of a business model.
	  weight:: 90
	  guide:: Complete the item
	  mode:: basic
	  color:: red
	  aiFit:: 8
	  emoji:: 🔑
	  fields::
	  relations::
	- Suggestions
	  collapsed:: true
	  instantiable:: true
	  name:: Suggestions
	  slug:: suggestions
	  parentItem:: [[Analysis]]
	  type:: weight
	  weight:: 30
	  guide:: Complete the item
	  mode:: expert
	  color:: red
	  emoji:: 📂
	  fields::
	  relations::
	- Unfair advantage
	  collapsed:: true
	  instantiable:: true
	  name:: Unfair advantage
	  slug:: unfair-advantage
	  parentItem:: [[Analysis]]
	  type:: text
	  summary:: Unfair advantage refers to a unique and difficult-to-replicate attribute or strategy that gives a business a competitive edge.
	  weight:: 30
	  guide:: Complete the item
	  mode:: expert
	  color:: blue