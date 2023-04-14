package com.flipkart.config;

import com.flipkart.entity.Country;
import com.flipkart.entity.Product;
import com.flipkart.entity.ProductCategory;
import com.flipkart.entity.State;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.http.HttpMethod;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

import javax.persistence.EntityManager;
import javax.persistence.metamodel.EntityType;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Configuration
public class MyDataRestConfig implements RepositoryRestConfigurer {
	private EntityManager entityManager;

	@Autowired
	public MyDataRestConfig(EntityManager theEntityManager) {
		entityManager = theEntityManager;
	}

	@Override
	public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config, CorsRegistry cors) {

		RepositoryRestConfigurer.super.configureRepositoryRestConfiguration(config, cors);
		HttpMethod[] theUnsupportedAction = { HttpMethod.PUT, HttpMethod.POST, HttpMethod.DELETE };
		// Disable http methods for Product:POST,PUT,Delete
		disableHttpMehods(Product.class, config, theUnsupportedAction);

		// Disable http methods for Product:POST,PUT,Delete
		disableHttpMehods(ProductCategory.class, config, theUnsupportedAction);
		// Disable http methods for Country:POST,PUT,Delete
		disableHttpMehods(Country.class, config, theUnsupportedAction);
		// Disable http methods for State:POST,PUT,Delete
		disableHttpMehods(State.class, config, theUnsupportedAction);
		// call an internal helper method
		exposeIds(config);
	}

	private void disableHttpMehods(Class theClass, RepositoryRestConfiguration config,
			HttpMethod[] theUnsupportedAction) {
		config.getExposureConfiguration()
				.forDomainType(theClass)
				.withItemExposure((metdata, httpMethods) -> httpMethods.disable(theUnsupportedAction))
				.withCollectionExposure((metdata, httpMethods) -> httpMethods.disable(theUnsupportedAction));
	}

	private void exposeIds(RepositoryRestConfiguration config) {

		// expose entity ids
		//

		// - get a list of all entity classes from the entity manager
		Set<EntityType<?>> entities = entityManager.getMetamodel().getEntities();

		// - create an array of the entity types
		List<Class> entityClasses = new ArrayList<>();

		// - get the entity types for the entities
		for (EntityType tempEntityType : entities) {
			entityClasses.add(tempEntityType.getJavaType());
		}

		// - expose the entity ids for the array of entity/domain types
		Class[] domainTypes = entityClasses.toArray(new Class[0]);
		config.exposeIdsFor(domainTypes);
	}
}
